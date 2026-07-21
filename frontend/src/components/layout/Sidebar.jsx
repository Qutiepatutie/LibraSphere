import styles from "../../styles/components/layout/sidebar.module.css"

import { NavLink } from "react-router-dom"

import logo from "../../assets/libraSphere-logo.svg"
import dashboard from "../../assets/sidebar/dashboard.svg"
import library from "../../assets/sidebar/library.svg"
import borrowedBooks from "../../assets/sidebar/borrowedBooks.svg"
import addBook from "../../assets/sidebar/addbook-icon.svg"
import logoutIcon from "../../assets/sidebar/logout.svg"
import burger from "../../assets/sidebar/burger.svg"

import { logout, getStorage } from "../../pages/auth/auth.util.js"

export default function Sidebar({ showSidebar, setShowSidebar }) {
    const role = getStorage().getItem("role");

    return (
        <>
            {showSidebar && (
                <div
                    className={styles.backDrop}
                    onClick={() => setShowSidebar(false)}
                />
            )}
            <div className={`${styles.sidebar} ${showSidebar ? styles.active : ""}`}>
                <div className={styles.header}>
                    <div
                        className={styles.burgerContainer}
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <img src={burger} />
                    </div>
                    <img className={styles.logo} src={logo} />
                    <p className={styles.logoTitle}>LibraSphere</p>
                </div>
                <div className={styles.buttons}>
                    <NavLink
                        to = {role === "admin" ? "/admin/dashboard" : "/dashboard"}
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                        onClick={() => setShowSidebar(false)}
                    >
                        <img className={styles.icon} src={dashboard} />
                        <p>Dashboard</p>
                    </NavLink>
                    
                    <NavLink
                        to = "/library"
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                        onClick={() => setShowSidebar(false)}
                    >
                        <img className={styles.icon} src={library} />
                        <p>Library</p>                    
                    </NavLink>
                    
                    <NavLink
                        to = {role === "admin" ? "/admin/borrowers" : "/borrowed-books"}
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                        onClick={() => setShowSidebar(false)}
                    >
                        <img className={styles.icon} src={borrowedBooks} />
                        <p>{role === "admin" ? "Borrowers" : "Borrowed Books"}</p>
                    </NavLink>
                    
                    {role === "admin" &&
                         <NavLink 
                              to = "/admin/add-book"
                              className={({isActive}) => `${styles.navButton} ${isActive? styles.active : ""}`}
                              onClick={() => setShowSidebar(false)}
                         >
                              <img className={styles.icon} src={addBook} />
                              <p>Add Book</p>
                         </NavLink>
                    }
                    
                    <div 
                        className={styles.navButton}
                        onClick={() => {
                            setShowSidebar(false)
                            logout();
                        }}    
                    >
                        <img className={styles.icon} src={logoutIcon} />
                        <p>Log out</p>
                    </div>
                </div>
                <p className={styles.footer}>LibraSphere v1.0 | Copyright © by SOFE311 TEAM</p>
            </div>
        </>
    )
}