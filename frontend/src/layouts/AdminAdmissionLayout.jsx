import styles from "../styles/layouts/dashboardlayout.module.css"

import { NavLink, Outlet } from "react-router-dom"

export default function AdminAdmissionLayout() {
    return (
        <>
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.buttons}>
                        <NavLink
                            to="borrowers"
                            className={({ isActive }) => isActive ? styles.active : ""}
                        >
                            Borrowers
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