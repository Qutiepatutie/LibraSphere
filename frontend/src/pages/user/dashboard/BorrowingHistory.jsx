import styles from "../../../styles/userPages/dashboard/history.module.css"

import Table from "./Table.jsx"

export default function BorrowingHistory() {
    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <p className={styles.label}>Total Borrowed</p>
                <p className={styles.value}>0</p>
            </div>
            <div className={styles.panel}>
                <p className={styles.label}>Overdue</p>
                <p className={styles.value}>0</p>
            </div>
        
            <div className={styles.panel}>
                <p className={styles.label}>Due this week</p>
                <p className={styles.value}>0</p>
            </div>
        
            <div className={styles.panel}>
                <p className={styles.label}>Fine</p>
                <p className={styles.value}>₱0</p>
            </div>
        
            <div className={`${styles.panel} ${styles.table}`}>
                <Table />
            </div>
        </div>
    )
}