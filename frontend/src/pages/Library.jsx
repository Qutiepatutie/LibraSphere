import styles from '../styles/library.module.css'
import searchIcon from '../assets/search-icon.svg'

import { useState, useEffect } from 'react';
import { getAllBorrowedBooks, getBooks } from '../api/books'

export default function Library({ setViewBook, setBook, book }){

    const [booksByCategory, setBooksByCategory] = useState({
        gen_info: [],
        phil_psych: [],
        religion: [],
        soc_sci: [],
        languange: [],
        science: [],
        technology: [],
        arts_rec: [],
        literature: [],
        hist_geo: [],
    });

    const categories = {
            '001' : "001 | General Information",
            '100' : "100 | Philosophy & Psychology",
            '200' : "200 | Religion",
            '300' : "300 | Social Sciences",
            '400' : "400 | Language",
            '500' : "500 | Science",
            '600' : "600 | Technology",
            '700' : "700 | Arts & Recreation",
            '800' : "800 | Literature",
            '900' : "900 | History & Geology",
        };

    const allBooks = Object.values(booksByCategory).flat();

    const [booksBySearch, setBooksBySearch] = useState([]);
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);

    const [message, setMessage] = useState();
    const [show, setShow] = useState(false);

    const notify = () => {
        setShow(true);
        setTimeout(() => setShow(false), 2000);
    };

    useEffect(() => {
        async function fetchBooks() {
            try{
                const fetchedBooks = await getBooks();
                const fetchBorrowedBooks = await getAllBorrowedBooks();

                console.log(fetchedBooks.message);

                const borrowedBooksCallNumber = new Set(
                    fetchBorrowedBooks.data.map(b => b.book.call_number)
                );

                const borrowedBooks = fetchedBooks.data.map(book => ({
                    ...book,
                    isBorrowed: borrowedBooksCallNumber.has(book.call_number)
                }));

                const booksData = {};
    
                Object.keys(categories).forEach((key) => {
                    booksData[key.toLowerCase()] = [];
                });

                borrowedBooks.forEach((book) => {
                    const categoryKey = book.call_number.substring(0,3);

                    if(booksData[categoryKey]) {
                        booksData[categoryKey].push(book);
                    }
                });

                setBooksByCategory(booksData);
            } catch (err) {
                setMessage("Connection to server failed");
                notify();
                console.log(err);
            }
        }
        
        fetchBooks();
    }, [book]);

    useEffect(() => {
        if(!search){
            setSearching(false);
        }
    }, [search]);

    const handleSearch = (e) => {
        if(e) e.preventDefault();

        const query = search.trim().toLowerCase();

        if(!query) {
            setSearching(false);
            setBooksBySearch([]);
            return;
        }

        const filteredBooks = allBooks.filter(book => 
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) || 
            book.call_number.toLowerCase().includes(query)
        )

        setBooksBySearch(filteredBooks);
        setSearching(true);
    };

    return(
        <>
            <div className={`${styles.toast} ${show ? styles.show : ""}`}>{message}</div>
            <div className={styles.library} onSubmit={handleSearch}>
                <form className={styles.header}>
                    <p>Find all the literatures you want in just one search</p>
                    <div className={styles.searchBarContainer}>
                        <img src={searchIcon} className={styles.searchIcon} onClick={handleSearch}/>
                        <input
                            type="text"
                            className={styles.searchBar}
                            placeholder='Subject,Title,Author...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </form>

                <div 
                    className={`${styles.searchScroll}
                                ${searching ? styles.show : ""}
                                ${searching && booksBySearch.length === 0 ? styles.noResults : ""}`}
                >
                    {booksBySearch.length > 0 ? (
                        booksBySearch.map((book, i) => (
                            <div key = {i}
                                className={styles.bookPanels}
                                onClick={() => {
                                                setViewBook(true);
                                                setBook({...book});
                                            }
                                        }
                                >
                                {book.cover_path && (
                                    <img
                                        src={book.cover_path ? book.cover_path : searchIcon}
                                        alt="Cover"
                                        className={styles.bookCover}
                                    />
                                )}
                                <p>{book.title}</p>
                                <p>{book.author}</p>
                            </div>
                        ))
                    ) : (
                        <div style={{color:"#ededed", userSelect:"none"}}>
                            <h1>No Books Found</h1>
                        </div>
                    )}
                </div>

                <div className={`${styles.scroll} ${searching ? styles.hide : ""}`}>
                    {Object.keys(categories).map((category, i) => (
                        <div key={i} className={styles.category}>
                            <div className={styles.categoryHeader}>
                                <p>{categories[category]}</p>
                            </div>
                            <div className={styles.books}>
                                {booksByCategory[category.toLowerCase()]?.length > 0 ? (
                                    booksByCategory[category.toLowerCase()].map((book, j) => (
                                        <div key={j}
                                            className={styles.bookPanels}
                                            onClick={() => {
                                                setViewBook(true);
                                                setBook({...book});
                                            }
                                        }>
                                            {book.cover_path && (
                                                <img
                                                    src={book.cover_path}
                                                    alt={book.title}
                                                    className={styles.bookCover}
                                                />
                                            )}
                                            <p>{book.title}</p>
                                            <p>{book.author}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noBooks}>
                                        <h1>No Books Available</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </> 
    )
}