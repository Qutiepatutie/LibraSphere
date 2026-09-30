import styles from "../../../styles/userPages/borrowedBooks/borrowedbooks.module.css"

import { useState } from "react"

import { useBorrowers } from "../../../hooks/useBorrowers.js"
import { getBookStatus } from "../../../utils/getBookStatus.js"
import { getStorage } from "../../auth/auth.util.js";
import BookPanel from "../../../components/library/BookPanel.jsx"
import Details from "./Details.jsx"

export default function BorrowedBooks() {

    const [showDetails, setShowDetails] = useState(false);
    const [currBook, setCurrBook] = useState(null);

    const { allBorrowers } = useBorrowers();

    const borrowedBooks = allBorrowers
        .filter(borrower =>
            borrower.user.id_number === getStorage().getItem("id_number")
            && borrower.status !== "Returned"
            && borrower.status !== "Cancelled")
        .map(book => ({
            ...book,
            status: getBookStatus(book),
        }));

    const overdueBooks =
        borrowedBooks.filter(book => book.status === "Overdue");

    const dueBooks =
        borrowedBooks.filter(book => book.status === "Due");

    const bookFine = overdueBooks.length * 25;

    return (
        <div className={styles.borrowedBooks}>
            <div className={styles.container}>
                <div className={styles.panel}>
                    <p className={styles.value}>{borrowedBooks.length}</p>
                    <p className={styles.label}>Total Borrowed</p>
                </div>
                <div className={styles.panel}>
                    <p className={styles.value}>{overdueBooks.length}</p>
                    <p className={styles.label}>Overdue</p>
                </div>

                <div className={styles.panel}>
                    <p className={styles.value}>{dueBooks.length}</p>
                    <p className={styles.label}>Due this week</p>
                </div>

                <div className={styles.panel}>
                    <p className={styles.value}>₱ {bookFine}</p>
                    <p className={styles.label}>Fine</p>
                </div>

                <div className={`${styles.panel} ${styles.books}`}>
                    {borrowedBooks.length === 0
                        ? (<h1 className={styles.noBooks}>No Books Borrowed</h1>)
                        : (borrowedBooks.map((book, index) => (
                            <div
                                key={index}
                                className={styles.bookContainer}
                                onClick={() => {
                                    setCurrBook({ ...book.book, ...borrowedBooks[index] });
                                    setShowDetails(true)
                                }}
                            >
                                <div className={`${styles.statusBar} ${styles[book.status]}`}>
                                    <p>{book.status}</p>
                                </div>
                                <BookPanel
                                    key={index}
                                    book={book.book}
                                    status={book.status}
                                    hover={false}
                                />
                            </div>
                        )))
                    }
                </div>
            </div>

            {showDetails &&
                <Details
                    setShowDetails={setShowDetails}
                    book={currBook}
                />
            }
        </div>
    )
}
