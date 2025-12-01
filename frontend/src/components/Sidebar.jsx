import { useState } from 'react'

import styles from '../styles/sidebar.module.css'

import dashboard from '../assets/sidebar/dashboard.svg'
import library from '../assets/sidebar/library.svg'
import borrowedBooks from '../assets/sidebar/borrowedBooks.svg'
import addbook from '../assets/sidebar/addbook-icon.svg'
import settings from '../assets/sidebar/settings.svg'
import logo from '../assets/libraSphere-logo.svg'

export default function Sidebar({ onNavigate, isOpen, role }){

    const [focused, setFocused] = useState("Dashboard");
    const [extended, setExtended] = useState(false);

    return(
        <>
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <img src={logo} className={styles.logo}/>
                    <h1>LibraSphere</h1>
                </div>
                <hr className={styles.divider} />
                <div className={styles.buttons}>

                    <div onClick={() => {setFocused("Dashboard"); onNavigate("Dashboard")}} className={focused === "Dashboard" ? styles.focused : ""}>
                        <img src={dashboard} className={styles.icons}/>
                        <p>Dashboard</p>
                    </div>

                    <div onClick={() => {setFocused("Library"); onNavigate("Library")}} className={focused === "Library" ? styles.focused : ""}>
                        <img src={library} className={styles.icons}/>
                        <p>Library</p>
                    </div>

                    <div
                        onClick={() => {setFocused("Borrowed Books"); onNavigate("Borrowed Books")}}
                        className={`${focused === "Borrowed Books" ? styles.focused : ""}
                                    ${sessionStorage.getItem("role") === "admin" ? styles.hidden : ""}`}>

                        <img src={borrowedBooks} className={styles.icons}/>
                        <p>Borrowed Books</p>
                    </div>

                    <div
                        onClick={() => {setFocused("Borrower Logs"); onNavigate("Borrower Logs")}}
                        className={`${focused === "Borrower Logs" ? styles.focused : ""}
                                    ${sessionStorage.getItem("role") === "admin" ? "" : styles.hidden}`}
                    >
                        <img src={borrowedBooks} className={styles.icons}/>
                        <p>Borrower Logs</p>
                    </div>

                    <div
                        onClick={() => {setFocused("Add Books"); onNavigate("Add Books")}}
                        className={`${focused === "Add Books" ? styles.focused : ""}
                                    ${sessionStorage.getItem("role") === "admin" ? "" : styles.hidden}`}
                    >
                        <img src={addbook} className={styles.icons}/>
                        <p>Add Books</p>
                    </div>

                    <div onClick={() => isOpen(true)} className={styles.settingsButton}>
                        <img src={settings} className={styles.icons}/>
                        <p>Settings</p>
                    </div>

                </div>
                
                <div className={styles.footer}>
                    <p>LibraSphere v1.0 | Copyright © by SOFE311 TEAM</p>
                </div>
            </div>
        </>
    );
}