import styles from '../styles/borrowerlogs.module.css';

import search from '../assets/search-icon.svg';

import { useState, useEffect } from 'react';

import { getAllBorrowedBooks } from '../api/books';

export default function BorrowerLogs(){

    const [borrowedBooks, setBorrowedBooks] = useState([]);

    useEffect(() => {
        async function fetchBorrowedBooks() {
            try{
              const fetchedBorrowedBooks = await getAllBorrowedBooks();
              setBorrowedBooks(fetchedBorrowedBooks);
              console.log(fetchedBorrowedBooks);
            }catch(err){
                console.log(err);
            }
        }

        fetchBorrowedBooks();
    }, []);

    return(
        <>
            <div className={styles.borrowerLogs}>
                <form className={styles.searchContainer} /* onSubmit={handleSearch} */>
                    <div className={styles.searchBarContainer}>
                        <img src={search} className={styles.searchIcon} /* onClick={handleSearch} *//>
                        <input
                            type='text'
                            name='pending'
                            className={styles.searchBar}
                            /* onChange={handleChange} */
                            placeholder='Search by name or student number'
                        /> 
                    </div>
                </form>

                {/*TODO: propose change of status col to date borrowed */}
                <div className={styles.table}>
                    <table>
                        <thead>
                           <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Student ID</th>
                                <th>Email</th>
                                <th>Program</th>
                                <th>Status</th>
                            </tr> 
                        </thead>
                        
                        <tbody>
                            {borrowedBooks.map((b, i) => (
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>{`${b.user.first_name} ${b.user.last_name}`}</td>
                                    <td>{b.user.student_number}</td>
                                    <td>{b.user.email}</td>
                                    <td>{b.user.program}</td>
                                    <td><span className={`${styles.status} ${styles[b.status]}`}>{b.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </>
    )
}