import styles from "../../../styles/userPages/dashboard/tablecontainer.module.css"

import { useBorrowedBooks } from "../borrowedBooks/useBorrowedBooks"

export default function CurrentBorrowedTable() {

    const { borrowedBooks } = useBorrowedBooks();

    const dueBooks = 
        borrowedBooks.filter(book => book.status === "Due" || book.status === "Overdue");

    console.log(dueBooks);
    
    return (
        <div className={styles.container}>
            <div className={styles.header} >
                <p>Current Borrowed Books </p>
            </div>
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date Borrowed</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dueBooks.map((book) => (
                            <tr key={book.book.title}>
                                <td>{book.book.title}</td>
                                <td>{book.borrow_date.slice(0,10)}</td>
                                <td>{book.due_date}</td>
                                <td>{book.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}