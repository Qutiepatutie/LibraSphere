import styles from "../../../styles/userPages/dashboard/tablecontainer.module.css"

import { useLocation } from "react-router-dom"; 
import { getStorage } from "../../auth/auth.util";

import { useBorrowedBooks } from "../borrowedBooks/useBorrowedBooks"
import { useBorrowers } from "../../../hooks/useBorrowers";
import { statisticsTable, historyTable } from "./table.constants";

export default function CurrentBorrowedTable() {

    const { borrowedBooks } = useBorrowedBooks();
    const { allBorrowers } = useBorrowers();
    const location = useLocation();
    const isLocStats = location.pathname.endsWith("/statistics") 

    const borrowHistory =
        allBorrowers.filter(borrower =>
            borrower.user.id_number === getStorage().getItem("id_number") &&
            !["Due", "Overdue"].includes(borrower.book.status)
        );

    const dueBooks = 
        borrowedBooks.filter(book => book.status === "Due" || book.status === "Overdue");
    
    const tableTitles =
         isLocStats ? statisticsTable : historyTable;
    
    const checkDate = (date) => {
        return date ? date : "Cancelled";
    }
    
    return (
        <div className={styles.container}>
            {isLocStats && (
                <div className={styles.header} >
                    <p>Borrowed Books Reminder</p>
                </div>
            )}
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            {tableTitles.map(title => (
                                <th key={title}>{title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLocStats ? (
                            dueBooks.map((book, index) => (
                                <tr key={index}>
                                    <td>{book.book.title}</td>
                                    <td>{book.borrow_date.slice(0,10)}</td>
                                    <td>{book.due_date}</td>
                                    <td>{book.status}</td>
                                </tr>
                        ))) : (
                            borrowHistory.map((book, index) => (
                                <tr key={index}>
                                    <td>{book.book.title}</td>
                                    <td>{checkDate(book.borrow_date?.slice(0, 10))}</td>
                                    <td>{checkDate(book.due_date)}</td>
                                    <td>{book.return_date}</td>
                                    <td>--</td> {/* TEMPORARY */}
                                </tr>
                            )))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}