import styles from "../../styles/components/layout/bottomnav.module.css"

import { NavLink, useLocation } from "react-router-dom"

import dashboard from "../../assets/sidebar/dashboard.svg"
import library from "../../assets/sidebar/library.svg"
import borrowedBooks from "../../assets/sidebar/borrowedBooks.svg"
import addBook from "../../assets/sidebar/addbook-icon.svg"
import logoutIcon from "../../assets/sidebar/logout.svg"

import { logout, getStorage } from "../../pages/auth/auth.util.js"

export default function Sidebar() {
    const role = getStorage().getItem("role");

    const location = useLocation();
    
    const isDashboardActive =
        role === "admin"
            ? location.pathname.startsWith("/admin/dashboard")
            : location.pathname === "/dashboard"

    return (
        <>
            <div className={styles.bottomNav}>
                <div className={styles.buttons}>
                    <NavLink
                        to = {role === "admin" ? "/admin/dashboard/statistics" : "/dashboard"}
                        className={`${styles.navButton} ${isDashboardActive ? styles.active : ""}`}
                    >
                        <img className={styles.icon} src={dashboard} />
                    </NavLink>
                    
                    <NavLink
                        to = "/library"
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                    >
                        <img className={styles.icon} src={library} />
                    </NavLink>
                    
                    <NavLink
                        to = {role === "admin" ? "/admin/borrowers" : "/borrowed-books"}
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                    >
                        <img className={styles.icon} src={borrowedBooks} />
                    </NavLink>
                    
                    {role === "admin" &&
                         <NavLink 
                              to = "/admin/add-book"
                              className={({isActive}) => `${styles.navButton} ${isActive? styles.active : ""}`}
                         >
                              <img className={styles.icon} src={addBook} />
                         </NavLink>
                    }
                    
                    <div 
                        className={styles.navButton}
                        onClick={() => {
                            logout();
                        }}    
                    >
                        <img className={styles.icon} src={logoutIcon} />
                    </div>
                </div>
                {/* <p className={styles.footer}>LibraSphere v1.0 | Copyright © by SOFE311 TEAM</p>*/}
            </div>
        </>
    )
}