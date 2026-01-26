import styles from "../../styles/userPages/borrowedbooks.module.css"

import total from "../../assets/pages/borrowedbooks/total-borrowed-icon.svg"
import overdue from "../../assets/pages/borrowedbooks/overdue-icon.svg"
import due from "../../assets/pages/borrowedbooks/due-icon.svg"
import fine from "../../assets/pages/borrowedbooks/fine-icon.svg"

import { useBorrowers } from "../../hooks/useBorrowers"
import { getBookStatus } from "../../utils/getBookStatus"

export default function BorrowedBooks() {

    const { allBorrowers } = useBorrowers();
    
    const borrowedBooks = 
        allBorrowers.filter(borrower => 
            borrower.user.student_number === localStorage.getItem("id_number"));

    const bookStatus = borrowedBooks.map(book => ({
        ...book,
        status: getBookStatus(book),
    }));

    const overdueBooks = 
        bookStatus.filter(book => book.status === "Overdue");

    const dueBooks = 
        bookStatus.filter(book => book.status === "Due");
       
    const bookFine = overdueBooks.length * 25;

    return (
        <div className={styles.borrowedBooks}>
            <div className={styles.panel}>
                <div className={styles.info}>
                    <img src={total}/> 
                    <p>Total Borrowed</p>
                </div>
                <p>{borrowedBooks.length}</p>
            </div>
            <div className={styles.panel}>
                <div className={styles.info}>
                    <img src={overdue}/> 
                    <p>Overdue</p>
                </div>
                <p>{overdueBooks.length}</p>
            </div>

            <div className={styles.panel}>
                <div className={styles.info}>
                    <img src={due}/> 
                    <p>Due this week</p>
                </div>
                <p>{dueBooks.length}</p>
            </div>

            <div className={styles.panel}>
                <div className={styles.info}>
                    <img src={fine}/> 
                    <p>Fine</p>
                </div>
                <p>{bookFine}</p>
            </div>

            <div className={styles.panel}>
                {borrowedBooks.length === 0
                ? (<h1 className={styles.noBooks}>No Books Borrowed</h1>)
                :   (borrowedBooks.map((book) => (
                        <div key={book.book.ISBN} className={styles.bookPanel}>
                            <img className={styles.cover} src={book.book.cover_path}/> 
                            <div className={`${styles.status} ${styles[book.status]}`}>
                                <p>{book.status}</p>
                            </div>
                        </div>
                    ))) 
                } 
            </div>
        </div>
    )
}