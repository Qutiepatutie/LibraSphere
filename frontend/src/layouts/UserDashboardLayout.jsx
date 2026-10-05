import styles from "../styles/layouts/dashboardlayout.module.css"

import { NavLink, Outlet } from "react-router-dom"

export default function UserDashboardLayout() {
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
                            to="history"
                            className={({ isActive }) => isActive ? styles.active : ""}
                        >
                            Borrowing History
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