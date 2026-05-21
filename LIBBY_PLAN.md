# Libby AI — Implementation Plan

Library assistant for L.I.B.R.A. (OLFU LMS). Three capabilities: institutional Q&A (RAG), conversational book recommendations, hybrid catalog search. Single-Postgres architecture using `pgvector` + `pg_trgm`.

Source spec: `LibbyAI.pdf` (System Architecture, Layers 1–5).

---

## Phased Roadmap

### Phase 0 — Hybrid Search (FIRST GOAL, Subsystem C)

Ship the catalog search bar before any LLM/RAG/recommendation work. Pure SQL; no embeddings, no LLM yet. This proves out Postgres extensions, indexing strategy, and the result-blending pattern that semantic search will reuse later.

**Why first:** smallest blast radius, no LLM cost, no embedding pipeline, zero new infra (just two Postgres extensions). Delivers immediate user-visible value on existing `books` table (`backend/library/models.py:13`). Establishes the data + index foundation that Subsystem B (recommendations) will piggyback on.

#### 0.1 Database prep
- Enable extensions: `CREATE EXTENSION IF NOT EXISTS pg_trgm;` and `CREATE EXTENSION IF NOT EXISTS pgvector;` (vector now so we don't re-migrate later).
- Add generated `tsvector` column on `books` concatenating `title || author || isbn || call_number`, weighted (`A` for title, `B` for author, `C` for isbn/call_number).
- Add `embedding vector(768)` column on `books` — leave NULL for now, populated in Phase 2. Dimension locked to `nomic-embed-text` (768). **Changing the embedding model later = full re-embed + new column.**
- Indexes:
  - `GIN` on the generated `tsvector` column (BM25/lexical).
  - `GIN` on `title` and `author` using `gin_trgm_ops` (fuzzy / misspelling tolerance).
  - `ivfflat` on `embedding` (created in Phase 2 once vectors exist).
- Migration file: `backend/library/migrations/000X_search_columns.py` (use `RunSQL` for extensions + generated column; Django ORM doesn't model these natively).

#### 0.2 Backend search endpoint
- New view: `library/search.py` → `search_books(request)` mounted at `GET /searchBooks/?q=...&limit=20`.
- Three internal paths in priority order:
  1. **Exact match** — regex-detect ISBN-10/13 or call-number format → direct `Books.objects.filter(isbn=q) | Q(call_number=q)`. Short-circuit, return immediately, no ranking.
  2. **Lexical (BM25)** — `to_tsquery(plainto_tsquery('english', q))` against the generated `tsvector`, ordered by `ts_rank_cd(...) DESC`.
  3. **Fuzzy fallback** — when lexical returns 0 hits, run `similarity(title, q) + similarity(author, q)` via `pg_trgm`, threshold 0.3.
- Return raw DB rows (no LLM rewriting per spec Layer 5 safety rule).
- Response shape stays consistent with project pattern: `{"status": "success", "data": [...]}`.

#### 0.3 Frontend wiring
- New API function `searchBooks(query)` in `frontend/src/api/books.js` (mirrors existing `fetch` pattern).
- Hook the existing `SearchBar` component (`frontend/src/components/ui/Inputs.jsx`) to call it with debounce (~250ms).
- Render results in `Library` page (`frontend/src/pages/user/library/`) — replace current client-side filter with server-driven results.
- Empty state: "No matches. Try a broader term."

#### 0.4 Acceptance criteria for Phase 0
- "9780064410939" → exact ISBN row, <50ms.
- "Eric Carle" → all his books ranked by relevance.
- "very hungry catterpilar" (typo) → fuzzy hit on the correct title.
- "books about butterflies" → returns weak/no results (semantic gap acknowledged — Phase 2 closes this).
- Zero LLM calls. No embedding column populated yet.

---

### Phase 1 — Query Router (Layer 1)

Add the lightweight intent classifier in front of the search bar / chat entry point. Start rule-based per spec ("Start rule-based, upgrade if needed").

- `library/router.py` with `classify_intent(query) -> Literal["policy", "recommend", "search", "smalltalk"]`.
- Rule pass: ISBN/call-number regex → `search`; keywords `fine|hours|policy|rule|handbook|return|overdue` → `policy`; `recommend|suggest|books about|similar to|like` → `recommend`; else → `search` as default.
- Logged to `query_logs` table (created here, used through every later phase).
- LLM fallback deferred until rule-based misclassification rate is measurable.

---

### Phase 2 — Semantic Search Extension to Hybrid (closes Path A)

Now Phase 0's hybrid is missing the conceptual half ("books about grief"). Backfill embeddings + RRF blending.

- Embedding pipeline: management command `python manage.py embed_books` that concatenates `title + author + tags + description`, calls `nomic-embed-text` via Ollama (768-dim), upserts into `books.embedding`. Idempotent — only re-embed rows where source text hash changed.
- Add `ivfflat` index on `embedding` once populated.
- Extend `search_books` view: when query is conceptual (router returns `search` but no exact/lexical hit, or query length > 4 words), run pgvector cosine search in parallel with lexical.
- **Reciprocal Rank Fusion** merger: `score = Σ 1 / (60 + rank_in_list)`. No score normalization. Return single unified ranked list.
- Description enrichment fallback: books with empty `description` get one-pass Open Library lookup by ISBN at embed time, otherwise LLM tag-expansion. Track which path was used in a new `description_source` column.

---

### Phase 3 — Subsystem A: RAG Pipeline (Institutional Knowledge)

Per spec Layer 2.A.

- New table `policy_chunks(id, source_doc, section, chunk_text, embedding vector(768))`.
- Ingestion script: load OLFU handbook + library rules (Markdown / DOCX), split by heading/paragraph (NOT fixed token windows), embed each chunk, insert.
- View: `POST /askPolicy/` → embed question, top-k=3 cosine retrieval, pass to LLM with strict prompt: *answer only from provided context; cite source + section; if not found say "I couldn't find this in the library documents."*
- Citations rendered as inline links in frontend chat UI.

---

### Phase 4 — Subsystem B: Recommendation System (Conceptual Discovery)

Per spec Layer 2.B. Reuses Phase 2 embeddings.

- View: `POST /recommend/` → embed user query → top-5 cosine on `books.embedding` → LLM writes warm conversational pitch with one-line justification per book.
- Hard constraint enforced in prompt + post-processing: LLM may only mention titles/authors from the retrieved 5. Strip any hallucinated rows before returning.
- Frontend: chat surface in user dashboard.

---

### Phase 5 — Safety, Logging, Polish

- `query_logs` analytics dashboard (which subsystem fired, latency, did-user-click-result).
- Out-of-scope canned response wired through router.
- Rate limit chat endpoints (ties to existing security work in `SECURITY_NOTE.md`).
- Eval harness: 20 hand-written queries per intent with expected results, run before each release.

---

## Tech Stack (locked from spec)

| Concern | Choice |
|---------|--------|
| DB | Postgres (existing) |
| Vector | `pgvector` |
| Fuzzy | `pg_trgm` |
| Lexical | Postgres `tsvector` + `ts_rank_cd` (BM25-style) |
| Embeddings | **`nomic-embed-text` via Ollama, 768-dim** (local). Swap to `text-embedding-3-small` (1536) on cloud cutover. |
| Chat LLM | **Qwen2.5 7B Instruct (Q4_K_M) via Ollama, local** (~4.7GB VRAM, fits RTX 4050 6GB laptop). Cloud (e.g. GPT-4o-mini, Claude Haiku) on scale-out. |
| Orchestration | **None — no LangChain / LlamaIndex.** Plain Python: Django ORM + `psycopg` for DB, `ollama` Python client (or raw HTTP to `http://localhost:11434`) for LLM, f-strings/Jinja for prompts. |

### Hardware target
- **Dev / single-user prod:** RTX 4050 laptop, 6GB VRAM, ~194 GB/s mem bw.
- Reserve ~1GB VRAM for KV cache + OS → ~5GB budget for chat model weights.
- Qwen2.5 7B Q4_K_M (~4.7GB) + `nomic-embed-text` (~270MB) coexist comfortably.

### Why no orchestration framework
- Surface area is small: 3 subsystems, 1 LLM backend, 1 DB. LangChain abstractions add weight without unlocking anything we need.
- All retrieval is SQL — pgvector + tsvector are first-class in Postgres, no need for a vector-store wrapper.
- Easier to debug: every prompt + every SQL query is plain code in this repo, no hidden chain state.
- Swap-out path stays open: an `LLMClient` Protocol with `chat(messages, system) -> str` is enough to plug a cloud provider later without touching pipeline logic.
- Reconsider only if we add: multi-hop reasoning, tool-calling agents, simultaneous multi-provider routing.

### Why Qwen2.5 7B over Llama 3.2 3B
Llama 3.2 3B was the original pick. Upgrading to Qwen2.5 7B because the 4050's 6GB VRAM comfortably fits a 7B Q4 model, and the quality jump matters specifically for *this* workload:
- **JSON adherence** — Qwen2.5 returns clean structured output; Llama 3.2 3B regularly drops braces. Matters if/when the router upgrades from rule-based to LLM.
- **"Answer only from context" obedience** — Qwen2.5 7B refuses to hallucinate noticeably more often than 3B-class. Critical for the RAG safety rule (Layer 5).
- **Recommendation prose** — warmer, more varied, less template-y.
- Trade-off: ~30 tok/s vs ~60 tok/s on the 4050. Mitigated by streaming responses (Ollama SSE) so first-token latency stays sub-second.

Runners-up considered: **Llama 3.1 8B Q4** (~4.9GB, slightly tighter on context), **Phi-3.5 Mini 3.8B** (~2.4GB, pick if VRAM headroom needed), **Mistral 7B Instruct v0.3** (~4.4GB, solid all-rounder), **Gemma 2 9B Q4** (~5.5GB, highest quality but uncomfortably close to OOM under load).

### Qwen2.5 7B implications (design around these)
- **Context window** is 32k native, quality holds well to ~8k. Keep RAG top-k small (3 chunks for policy, 5 books for recommendations) and chunks tight (<400 tokens) anyway — pulls in less noise, faster inference.
- **JSON output** is reliable but still validate. If router goes LLM-based, use Ollama's `format: "json"` flag and fall back to rule-based on parse failure.
- **System prompts** can be denser than 3B-class tolerated, but keep one job per prompt (already aligned with spec Layer 4).
- **Embeddings ≠ chat model.** Chat = Qwen2.5 7B. Embeddings = `nomic-embed-text` (768-dim, ~270MB). Both run concurrently on the 4050 with no fight. Dimension is locked in the Phase 0.1 migration — changing later = full re-embed.
- **Latency.** ~25–35 tok/s on the 4050 mobile. Stream responses to the frontend (Ollama supports SSE) so chat doesn't feel frozen.
- **Cost ceiling = $0** while local. That makes generous re-embedding + eval runs cheap; use that headroom in Phase 5 eval harness.

### Cloud cutover plan (when we scale)
- Swap embedding model → re-run `embed_books` (full re-embed; vector dim changes 768 → 1536 if moving to `text-embedding-3-small` → new column, blue/green migrate).
- Swap chat model → flip `LLMClient` impl. Cloud models tolerate longer/denser prompts; some Qwen-specific workarounds may be removable.
- Trigger conditions: p95 chat latency > 3s, concurrent users > ~20, GPU pegged at >80% sustained, or routing/RAG quality plateau on the eval harness.

---

## File Layout (new code)

```
backend/library/
├── search.py            # Phase 0 — hybrid search view + helpers
├── router.py            # Phase 1 — intent classifier
├── embeddings.py        # Phase 2 — embed_books command + helpers
├── rag.py               # Phase 3 — policy QA pipeline
├── recommend.py         # Phase 4 — recommendation pipeline
├── prompts/             # all LLM system prompts (one per role)
│   ├── router.txt
│   ├── rag_answerer.txt
│   └── recommender.txt
└── migrations/
    └── 000X_search_columns.py
```

---

## Out of Scope (this plan)

- Replacing `books` schema (it's adequate; only additive columns).
- Switching off Django plain views to DRF (separate concern).
- Multi-language tokenization (English only for now).
- Real-time embedding updates on every book write — batch nightly is fine until catalog churn justifies otherwise.

---

## Immediate Next Action

Phase 0.1 — write the migration enabling `pg_trgm` + `pgvector`, adding the generated `tsvector` column, the `vector(768)` column (NULL for now), and the GIN indexes. Nothing else until that lands and `python manage.py migrate` is green on a dev DB.

In parallel (no code dep): pull the models locally so they're ready for Phase 2.
```
ollama pull qwen2.5:7b-instruct-q4_K_M
ollama pull nomic-embed-text
```