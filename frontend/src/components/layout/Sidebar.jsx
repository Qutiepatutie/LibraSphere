import styles from "../../styles/components/layout/sidebar.module.css"

import { NavLink, useLocation } from "react-router-dom"

import logo from "../../assets/libra-logo.png"
import dashboard from "../../assets/sidebar/dashboard.svg"
import library from "../../assets/sidebar/library.svg"
import borrowedBooks from "../../assets/sidebar/borrowedBooks.svg"
import addBook from "../../assets/sidebar/addbook-icon.svg"
import discussionRoom from "../../assets/sidebar/discussion-room.svg"

import { getStorage } from "../../pages/auth/auth.util.js"

export default function Sidebar() {
    const role = getStorage().getItem("role");

    const location = useLocation();
    
    const isDashboardActive =
        role === "admin"
            ? location.pathname.startsWith("/admin/dashboard")
            : location.pathname === "/dashboard"

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <img className={styles.logo} src={logo} />
                </div>
                <div className={styles.buttons}>
                    <NavLink
                        to = {role === "admin" ? "/admin/dashboard/statistics" : "/dashboard"}
                        className={`${styles.navButton} ${isDashboardActive ? styles.active : ""}`}
                    >
                        <img className={styles.icon} src={dashboard} />
                        <p className={styles.tooltip}>Dashboard</p>
                    </NavLink>
                    
                    <NavLink
                        to = "/library"
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                    >
                        <img className={styles.icon} src={library} />
                        <p className={styles.tooltip}>Library</p>                    
                    </NavLink>
                    
                    <NavLink
                        to = {role === "admin" ? "/admin/borrowers" : "/borrowed-books"}
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                    >
                        <img className={styles.icon} src={borrowedBooks} />
                        <p className={styles.tooltip}>{role === "admin" ? "Borrowers" : "Borrowed Books"}</p>
                    </NavLink>

                    {role !== "admin" && (
                        <NavLink
                            to="/discussion-room-reservation"
                            className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                        >
                            <img className={styles.icon} src={discussionRoom} />
                            <p className={styles.tooltip}>Discussion Room Reservation</p>
                        </NavLink>
                        
                    )}
                    {role === "admin" && (
                        <NavLink 
                            to = "/admin/add-book"
                            className={({isActive}) => `${styles.navButton} ${isActive? styles.active : ""}`}
                        >
                            <img className={styles.icon} src={addBook} />
                            <p className={styles.tooltip}>Add Book</p>
                        </NavLink>
                    )}
                </div>
            </div>
        </>
    )
}