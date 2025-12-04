import styles from '../styles/borrowedbooks.module.css'

import { useState, useEffect } from 'react'
import { getUserBorrowedBooks } from '../api/books'

import totalBorrowedIcon from '../assets/borrowedbooks/total-borrowed-icon.svg'
import overdueIcon from '../assets/borrowedbooks/overdue-icon.svg'
import dueIcon from '../assets/borrowedbooks/due-icon.svg'
import fineIcon from '../assets/borrowedbooks/fine-icon.svg'

export default function BorrowedBooks(){

    const [borrowedBooks, setBorrowedBooks] = useState([]);
    
    const [message, setMessage] = useState();
    const [show, setShow] = useState(false);

    const totalBorrowed = borrowedBooks.length;
    const overdues = borrowedBooks.filter(book => book.status === "Overdue").length;
    const dues = borrowedBooks.filter(book => isDueThisWeek(book.due_date)).length;

    const fines = overdues * 50;

    function getStartAndEndOfWeek() {
        const today = new Date();
        today.setHours(0,0,0,0);

        const diffToMonday = today.getDay() === 0 ? -6 : 1 - today.getDay();
        
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() + diffToMonday);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return { weekStart, weekEnd};
    }

    function isDueThisWeek(dueDate) {
        if(!dueDate) return false;

        const {weekStart, weekEnd} = getStartAndEndOfWeek();
        
        const due = new Date(dueDate);
        due.setHours(0,0,0,0);

        return due >= weekStart && due <= weekEnd;
    }

    function getBookStatus(b) {
        if(!b.due_date) return b.status;

        const today = new Date();
        today.setHours(0,0,0,0);

        const due = new Date(b.due_date);
        due.setHours(0,0,0,0);

        if(due < today) return "Overdue";
        else if(due.getTime() === today.getTime()) return "Due";

        return b.status;
    }

    const notify = () => {
        setShow(true);
        setTimeout(() => setShow(false), 2000);
    };

    useEffect(() => {
        async function fetchBorrowedBooks(){
            try{
                const borrowedBooks = await getUserBorrowedBooks({
                    "id" : sessionStorage.getItem("id")
                });

                if(borrowedBooks.status === "success") {
                    /* FOR TESTING */

                    /* const updatedBooks = borrowedBooks.books.map(b => {
                        const test = {...b, due_date: '2025-12-01'};
                        return {...test, status: getBookStatus(test)};
                    }); */

                    const updatedBooks = borrowedBooks.books.map(b => ({
                        ...b,
                        status: getBookStatus(b)
                    }));

                    setBorrowedBooks(updatedBooks);
                    console.log(borrowedBooks.books);
                } else {
                    setMessage(borrowedBooks.message);
                    notify();
                }

            }catch(err){z
                console.log(err);
            }
        }

        fetchBorrowedBooks();
    }, []);

    return(
        <>
            <div className={`${styles.toast} ${show ? styles.show : ""}`}>{message}</div>
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

                <div className={`${styles.books} ${borrowedBooks.length === 0 ? styles.noBorrowed : ""}`}>
                    {borrowedBooks.length > 0 ? (
                        borrowedBooks.map((book, i) => (
                        <div key={i} className={styles.bookPanel}>
                            <div className={styles.coverPlaceholder}>
                                <img src={book.cover_path}/>
                            </div>
                            <p className={`${styles.status} ${styles[book.status]}`}>{book.status}</p>
                            <p>{!book.due_date ? "" :`Due Date: ${book.due_date}`}</p>
                        </div>))
                        ) : (
                        <div style={{color:"#ededed", userSelect:"none"}}>
                            <h1>No Books Borrowed</h1>
                        </div>

                    )}
                </div>
            </div>
        </>
    )
}