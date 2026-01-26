import styles from "../../styles/components/layout/header.module.css"
import avatar from "../../assets/profile-icon.svg"

import { useLocation } from "react-router-dom"

export default function Header() {

    const { pathname } = useLocation();

    const currPage = {
        "/dashboard" : "Dashboard",
        "/library" : "Library",
        "/borrowed-books" : "Borrowed Books",

        "/admin/dashboard" : "Admin Dashboard",
        "/admin/borrowers" : "Borrowers",
        "/admin/add-book" : "Add Book",
    }

    return (
        <div className={styles.header}>
            <p className={styles.title}>{currPage[pathname]}</p>

            <div className={styles.profile}>
                <img className={styles.avatar} src={avatar}/>
                <div className={styles.profileInfo}>
                    <p>{localStorage.getItem("user")}</p>
                    <p className={styles.id}>ID: <span>{localStorage.getItem("id_number")}</span></p>
                </div>
            </div>
        </div>
    )
}