import styles from "../../../styles/userPages/dashboard/statistics.module.css"

import LineGraph from "./graphs/Line.jsx"
import BarGraph from "./graphs/Bar.jsx"
import Table from "./Table.jsx"

export default function UserStatistics() {
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

            <div className={`${styles.panel} ${styles.doughnutGraphContainer}`}>
                <LineGraph />
            </div>
            
            <div className={`${styles.panel} ${styles.barGraphContainer}`}>
                <BarGraph />
            </div>
        
            <div className={`${styles.panel} ${styles.books}`}>
                <Table />
            </div>
        </div>
    )
}