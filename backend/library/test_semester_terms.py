from datetime import date

from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models.deletion import ProtectedError
from django.test import TestCase

from .models import AcademicTerm, SemesterTerm


class SemesterTermTests(TestCase):
    def setUp(self):
        self.academic_term = AcademicTerm.objects.create(
            academic_year="2026-2027",
            semester="1",
            education_level="college",
            start_date=date(2026, 8, 17),
            end_date=date(2026, 12, 18),
        )

    def make_period(self, **overrides):
        values = {
            "academic_term": self.academic_term,
            "semester_term": "prelims",
            "start_date": date(2026, 8, 17),
            "end_date": date(2026, 9, 28),
        }
        values.update(overrides)
        return SemesterTerm.objects.create(**values)

    def test_valid_periods_can_cover_parent_dates(self):
        prelims = self.make_period()
        midterms = self.make_period(
            semester_term="midterms",
            start_date=date(2026, 9, 29),
            end_date=date(2026, 11, 2),
        )
        finals = self.make_period(
            semester_term="finals",
            start_date=date(2026, 11, 3),
            end_date=self.academic_term.end_date,
        )
        self.assertEqual(
            set(self.academic_term.semester_terms.values_list("pk", flat=True)),
            {prelims.pk, midterms.pk, finals.pk},
        )
        self.assertEqual(prelims.academic_term.academic_year, "2026-2027")
        self.assertEqual(prelims.academic_term.semester, "1")
        self.assertEqual(prelims.academic_term.education_level, "college")

    def test_period_name_must_be_a_supported_choice(self):
        with self.assertRaises(ValidationError):
            self.make_period(semester_term="quarter")

    def test_duplicate_period_name_rejected_even_with_disjoint_dates(self):
        self.make_period()
        with self.assertRaises(ValidationError):
            self.make_period(
                start_date=date(2026, 9, 29), end_date=date(2026, 10, 1)
            )

    def test_database_rejects_duplicate_period_name(self):
        self.make_period()
        with self.assertRaises(IntegrityError), transaction.atomic():
            SemesterTerm.objects.bulk_create([
                SemesterTerm(
                    academic_term=self.academic_term,
                    semester_term="prelims",
                    start_date=date(2026, 9, 29),
                    end_date=date(2026, 10, 1),
                )
            ])

    def test_reversed_dates_rejected_on_save(self):
        with self.assertRaises(ValidationError):
            self.make_period(
                start_date=date(2026, 9, 28), end_date=date(2026, 8, 17)
            )

    def test_database_rejects_reversed_dates(self):
        period = self.make_period()
        with self.assertRaises(IntegrityError), transaction.atomic():
            SemesterTerm.objects.filter(pk=period.pk).update(
                end_date=date(2026, 8, 16)
            )

    def test_single_day_period_is_valid(self):
        period = self.make_period(end_date=date(2026, 8, 17))
        self.assertEqual(period.start_date, period.end_date)

    def test_dates_must_stay_within_parent(self):
        for overrides in (
            {"start_date": date(2026, 8, 16)},
            {"end_date": date(2026, 12, 19)},
        ):
            with self.subTest(**overrides), self.assertRaises(ValidationError):
                self.make_period(**overrides)
        self.assertFalse(self.academic_term.semester_terms.exists())

    def test_overlapping_periods_rejected_including_shared_endpoint(self):
        self.make_period()
        for start, end in (
            (date(2026, 9, 28), date(2026, 10, 1)),
            (date(2026, 9, 1), date(2026, 10, 1)),
            (date(2026, 9, 1), date(2026, 9, 2)),
            (date(2026, 8, 17), date(2026, 10, 1)),
        ):
            with self.subTest(start=start, end=end), self.assertRaises(ValidationError):
                self.make_period(
                    semester_term="midterms", start_date=start, end_date=end
                )
        self.assertEqual(self.academic_term.semester_terms.count(), 1)

    def test_existing_period_does_not_overlap_itself(self):
        period = self.make_period()
        period.end_date = date(2026, 9, 27)
        period.save()
        period.refresh_from_db()
        self.assertEqual(period.end_date, date(2026, 9, 27))

    def test_update_cannot_overlap_another_period(self):
        prelims = self.make_period()
        self.make_period(
            semester_term="midterms",
            start_date=date(2026, 9, 29),
            end_date=date(2026, 11, 2),
        )
        prelims.end_date = date(2026, 9, 29)
        with self.assertRaises(ValidationError):
            prelims.save()
        prelims.refresh_from_db()
        self.assertEqual(prelims.end_date, date(2026, 9, 28))

    def test_period_name_and_dates_are_scoped_to_parent(self):
        self.make_period()
        override = AcademicTerm.objects.create(
            academic_year="2026-2027",
            semester="1",
            education_level="college",
            year_level="1",
            start_date=self.academic_term.start_date,
            end_date=self.academic_term.end_date,
        )
        period = self.make_period(academic_term=override)
        self.assertEqual(period.academic_term.year_level, "1")
        self.assertEqual(SemesterTerm.objects.count(), 2)

    def test_parent_with_periods_cannot_be_deleted(self):
        period = self.make_period()
        with self.assertRaises(ProtectedError):
            self.academic_term.delete()
        self.assertTrue(SemesterTerm.objects.filter(pk=period.pk).exists())

    def test_parent_validation_rejects_dates_excluding_child(self):
        self.make_period()
        original_start = self.academic_term.start_date
        original_end = self.academic_term.end_date
        for start, end in (
            (date(2026, 8, 18), original_end),
            (original_start, date(2026, 9, 27)),
        ):
            with self.subTest(start=start, end=end), self.assertRaises(ValidationError):
                self.academic_term.start_date = start
                self.academic_term.end_date = end
                self.academic_term.full_clean()

    def test_parent_dates_can_match_child_boundaries(self):
        period = self.make_period()
        self.academic_term.start_date = period.start_date
        self.academic_term.end_date = period.end_date
        self.academic_term.full_clean()
        self.academic_term.save()

