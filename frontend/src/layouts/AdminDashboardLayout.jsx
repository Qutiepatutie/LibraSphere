import styles from "../styles/layouts/admindashboardlayout.module.css"

import { NavLink, Outlet } from "react-router-dom"

export default function AdminDashboardLayout() {
    return (
        <>
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.buttons}>
                        <NavLink
                            to="statistics"
                            className={({ isActive }) => isActive ? styles.active : ""}
                        >
                            Statistics
                        </NavLink>
                        
                        <NavLink
                            to="book-borrowers"
                            className={({ isActive }) => isActive ? styles.active : ""}
                        >
                            Book Borrowers
                        </NavLink>
                        
                        <NavLink
                            to="return-books"
                            className={({ isActive }) => isActive ? styles.active : ""}
                        >
                            Return Books
                        </NavLink>
                    </div> 
                    
                    <div className={styles.content}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}