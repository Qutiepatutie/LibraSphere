import styles from "../../styles/userPages/borrowedbooks.module.css"

import { useBorrowers } from "../../hooks/useBorrowers"
import { getBookStatus } from "../../utils/getBookStatus"
import BookPanel from "../../components/library/BookPanel.jsx"

export default function BorrowedBooks() {

    const { allBorrowers } = useBorrowers();
    
    const borrowedBooks = allBorrowers
        .filter(borrower => 
            borrower.user.id_number === localStorage.getItem("id_number")
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

            <div className={styles.panel}>
                {borrowedBooks.length === 0
                    ? (<h1 className={styles.noBooks}>No Books Borrowed</h1>)
                    : (borrowedBooks.map((book, index) => (
                        <BookPanel
                            key={index}
                            book={book.book}
                            status={book.status}
                            hover={false}
                        />
                    )))
                }
            </div>
        </div>
    )
}