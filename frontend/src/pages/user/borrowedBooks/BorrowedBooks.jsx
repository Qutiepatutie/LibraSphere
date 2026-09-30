import styles from "../../../styles/userPages/borrowedBooks/borrowedbooks.module.css"

import { useState, useEffect } from "react"
import { useBorrowedBooks } from "./useBorrowedBooks.js"

import BookPanel from "../../../components/library/BookPanel.jsx"
import Details from "./Details.jsx"

export default function BorrowedBooks() {

    const {
        borrowedBooks,
    } = useBorrowedBooks();

    const [showDetails, setShowDetails] = useState(false);
    const [currBook, setCurrBook] = useState(null);
    const [userBorrowedBooks, setUserBorrowedBooks] = useState(borrowedBooks);

    useEffect(() => {
        setUserBorrowedBooks(borrowedBooks);
    }, [borrowedBooks]);
    
    const overdueBooks =
        userBorrowedBooks.filter(book => book.status === "Overdue");
    
    const dueBooks =
        userBorrowedBooks.filter(book => book.status === "Due");
    
    const bookFine = overdueBooks.length * 25;

    return (
        <div className={styles.borrowedBooks}>
            <div className={styles.container}>
                <div className={styles.panel}>
                    <p className={styles.value}>{userBorrowedBooks.length}</p>
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
                    {userBorrowedBooks.length === 0
                        ? (<h1 className={styles.noBooks}>No Books Borrowed</h1>)
                        : (userBorrowedBooks.map((book, index) => (
                            <div
                                key={index}
                                className={styles.bookContainer}
                                onClick={() => {
                                    setCurrBook({ ...book.book, ...userBorrowedBooks[index] });
                                    setShowDetails(true)
                                }}
                            >
                                <div className={`${styles.statusBar} ${styles[book.status]}`}>
                                    <p>{book.status}</p>
                                </div>
                                <BookPanel
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
                    userBorrowedBooks={userBorrowedBooks}
                    setUserBorrowedBooks={setUserBorrowedBooks}
                />
            }
        </div>
    )
}
