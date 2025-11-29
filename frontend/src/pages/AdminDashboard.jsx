import { useState, useEffect } from 'react'

import styles from '../styles/admindashboard.module.css'
import search from '../assets/search-icon.svg'
import avatar from '../assets/placeholder.jpg'
import { getAllBorrowedBooks, acceptBorrowedBook, returnBook } from '../api/books';

export default function AdminDashboard() {

    const [pendingBooks, setPendingBooks] = useState([]);
    const [currrentBorrowedBooks, setCurrentBorrowedBooks] = useState([]);
    const [message, setMessage] = useState();
    const [show, setShow] = useState(false);

    const notify = () => {
        setShow(true);
        setTimeout(() => setShow(false), 2000);
    };

    useEffect(() => {
        async function fetchPendingBooks(){
            try{
                const fetchedPendingBooks = await getAllBorrowedBooks();

                const pending = [];
                const currentBorrowed = [];

                fetchedPendingBooks.forEach(b => {
                    if(b.status === 'Pending'){
                       pending.push(b) ;
                    } else {
                        currentBorrowed.push(b);
                    }
                        
                })

                setPendingBooks(pending);
                setCurrentBorrowedBooks(currentBorrowed);
                console.log(fetchedPendingBooks);
            } catch(err){
                console.log(err);
            }
        }
        fetchPendingBooks();
    }, [])
    
    const handleAccept = async (isbn, callNum) => {
        try{
            const data = await acceptBorrowedBook(isbn, callNum);
            if(data.status == "success"){
                setMessage(data.message); 

                setPendingBooks(prev => 
                    prev.filter(b => !(b.book.ISBN === isbn && b.book.call_number === callNum))
                );

                setCurrentBorrowedBooks(prev => {
                    const acceptedBook = pendingBooks.find(
                        b => b.book.ISBN === isbn && b.book.call_number === callNum
                    );
                    return acceptedBook ? [...prev, {...acceptedBook, status: "Active"}] : prev;
                });
                
            } else {
                setMessage(`Error: ${data.message}`);
            }
            
        }catch(err){
            console.log("Fetch Error:", err);
            setMessage("An Undexpected error occured");
        }

        notify();
    }

    const handleReturn = async (isbn, callNum) => {
        try{
            const data = await returnBook(isbn, callNum);

            if(data.status == "success"){
                setMessage(data.message);

                setCurrentBorrowedBooks(prev => 
                    prev.filter(b => !(b.book.ISBN === isbn && b.book.call_number === callNum))
                );

            } else {
                setMessage(`Error: ${data.message}`);
            }
        }catch(err){
            console.log("Return Book Error:", err);
            setMessage("An Undexpected error occured");
        }

        notify();
    }

    return (
        <>
            <div className={`${styles.toast} ${show ? styles.show : ""}`}>{message}</div>

            <div className={styles.adminDashboard}>
                <form className={styles.header}>
                    <div className={styles.searchContainer}>
                       <img src={search} className={styles.searchIcon}/>
                        <input type="text" className={styles.searchBar}/> 
                    </div>
                </form>
                <div className={styles.mainContainer}>
                    <div className={styles.innerContainer}>
                        <p>Pending Borrowers</p>
                        <div className={styles.pendingContainer}>
                            {pendingBooks.map((b, i) => (
                                <div key={i} className={styles.borrowerPanel}>
                                    <div className={styles.borrowerHeader}>
                                        <img src={avatar} className={styles.avatar}/>
                                        <div>
                                            <p>{`${b.user.first_name} ${b.user.last_name}`}</p>
                                            <p>{b.user.student_number}</p>
                                        </div>
                                        <div className={`${styles.status} ${styles[b.status]}`}>{b.status}</div>
                                    </div>
                                    <div className={styles.borrowerBody}>
                                        <div className={styles.info}>
                                            <p>
                                                <span>Book:</span>
                                                <span>{b.book.title}</span>
                                            </p>
                                            <p>
                                                <span>ISBN:</span>
                                                <span>{b.book.ISBN}</span>
                                            </p>
                                            <p>
                                                <span>Call Number:</span>
                                                <span>{b.book.call_number}</span>
                                            </p>
                                            
                                        </div>
                                        <button onClick={() => handleAccept(b.book.ISBN, b.book.call_number)}>Accept</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.innerContainer}>
                            <p>Current Borrowed Books</p>
                            <div className={styles.currentContainer}>
                                {currrentBorrowedBooks.map((b, i) => (
                                <div key={i} className={styles.borrowerPanel}>
                                    <div className={styles.borrowerHeader}>
                                        <img src={avatar} className={styles.avatar}/>
                                        <div>
                                            <p>{`${b.user.first_name} ${b.user.last_name}`}</p>
                                            <p>{b.user.student_number}</p>
                                        </div>
                                        <div className={`${styles.status} ${styles[b.status]}`}>{b.status}</div>
                                    </div>
                                    <div className={styles.borrowerBody}>
                                        <div className={styles.info}>
                                            <p>
                                                <span>Book:</span>
                                                <span>{b.book.title}</span>
                                            </p>
                                            <p>
                                                <span>ISBN:</span>
                                                <span>{b.book.ISBN}</span>
                                            </p>
                                            <p>
                                                <span>Call Number:</span>
                                                <span>{b.book.call_number}</span>
                                            </p>
                                            
                                        </div>
                                        <button onClick={() => handleReturn(b.book.ISBN, b.book.call_number)}>Return</button>
                                    </div>
                                </div>
                            ))}
                            </div>
                    </div> 
                </div>
                
            </div>
            
        </>
    )
}