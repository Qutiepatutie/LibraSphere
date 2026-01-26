import styles from "../../styles/components/layout/sidebar.module.css"

import { useNavigate, NavLink } from "react-router-dom"

import logo from "../../assets/libraSphere-logo.svg"
import dashboard from "../../assets/sidebar/dashboard.svg"
import library from "../../assets/sidebar/library.svg"
import borrowedBooks from "../../assets/sidebar/borrowedBooks.svg"
import addBook from "../../assets/sidebar/addbook-icon.svg"
import settings from "../../assets/sidebar/settings.svg"

export default function Sidebar() {
    
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const tempLogout = () => {
        localStorage.removeItem("isAuth");
        navigate("/");        
    }

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <img className={styles.logo} src={logo} />
                    <h1>LibraSphere</h1>
                </div>
                <div className={styles.buttons}>
                    <NavLink
                        to = {role === "admin" ? "/admin/dashboard" : "/dashboard"}
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                    >
                        <img className={styles.icon} src={dashboard} />
                        <p>Dashboard</p>
                    </NavLink>
                    <NavLink
                        to = "/library"
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                    >
                        <img className={styles.icon} src={library} />
                        <p>Library</p>                    
                    </NavLink>
                    <NavLink
                        to = {role === "admin" ? "/admin/borrowers" : "/borrowed-books"}
                        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.active : ""}`}
                    >
                        <img className={styles.icon} src={borrowedBooks} />
                        <p>{role === "admin" ? "Borrowers" : "Borrowed Books"}</p>
                    </NavLink>
                    {role === "admin" && 
                        <NavLink 
                            to = "/admin/add-book"
                            className={({isActive}) => `${styles.navButton} ${isActive? styles.active : ""}`}
                        >
                            <img className={styles.icon} src={addBook} />
                            <p>Add Book</p>
                        </NavLink> 
                    }
                    <div 
                        className={styles.navButton}
                        onClick={() => tempLogout()}    
                    >
                        <img className={styles.icon} src={settings} />
                        <p>Log out</p>
                    </div>
                </div>
                <p className={styles.footer}>LibraSphere v1.0 | Copyright © by SOFE311 TEAM</p>
            </div>
        </>
    )
}