import styles from '../styles/borrowedbooks.module.css'

import { useState, useEffect } from 'react'
import { getUserBorrowedBooks } from '../api/books'

import totalBorrowedIcon from '../assets/borrowedbooks/total-borrowed-icon.svg'
import overdueIcon from '../assets/borrowedbooks/overdue-icon.svg'
import dueIcon from '../assets/borrowedbooks/due-icon.svg'
import fineIcon from '../assets/borrowedbooks/fine-icon.svg'

export default function BorrowedBooks(){

    const [borrowedBooks, setBorrowedBooks] = useState([]);

    const totalBorrowed = borrowedBooks.length;
    const overdues = borrowedBooks.filter(book => book.status === "Overdue").length
    const dues = borrowedBooks.filter(book => book.status === "Due").length

    const fines = overdues * 50;

    useEffect(() => {
        async function fetchBorrowedBooks(){
            try{
                const borrowedBooks = await getUserBorrowedBooks( {"id" : sessionStorage.getItem("id")} );

                if(borrowedBooks.status === "success") {
                    setBorrowedBooks(borrowedBooks.books);
                    console.log(borrowedBooks.books);
                } else {
                    console.log(borrowedBooks.message);
                }

            }catch(err){
                console.log(err);
            }
        }

        fetchBorrowedBooks();
    }, []);

    return(
        <>
            {/*TODO: FIX STATISTICS */}
            
            <div className={styles.borrowedBooks}>
                <div className={styles.upper}>
                    <div className={styles.infoPanel}>
                        <div className={styles.header}>
                           <img src={totalBorrowedIcon} className={styles.icon} />
                            <p>Total Borrowed</p> 
                        </div>
                        <p>{totalBorrowed}</p>
                    </div>
                    <div className={styles.infoPanel}>
                        <div className={styles.header}>
                            <img src={overdueIcon} className={styles.icon} />
                            <p>Overdue Books</p>
                        </div>
                        <p>{overdues}</p>
                    </div>
                    <div className={styles.infoPanel}>
                        <div className={styles.header}>
                            <img src={dueIcon} className={styles.icon} />
                            <p>Due this week</p>
                        </div>
                        <p>{dues}</p>
                    </div>
                    <div className={styles.infoPanel}>
                        <div className={styles.header}>
                            <img src={fineIcon} className={styles.icon} />
                            <p>Fine</p>
                        </div>
                        <p style={{color:"#740000"}}>₱{fines}</p>
                    </div>
                </div>

                <div className={styles.books}>
                    {borrowedBooks.map((book, i) => (
                    <div key={i} className={styles.bookPanel}>
                        <div className={styles.coverPlaceholder}>
                            <img src={book.cover_path}/>
                        </div>
                        <p className={`${styles.status} ${styles[book.status]}`}>{book.status}</p>
                        <p>{!book.due_date ? "" :`Due Date: ${book.due_date}`}</p>
                    </div>))}
                </div>
            </div>
        </>
    )
}