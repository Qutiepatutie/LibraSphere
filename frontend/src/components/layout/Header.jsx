import styles from "../../styles/components/layout/header.module.css"

import avatar from "../../assets/profile-icon.svg"
import burger from "../../assets/sidebar/burger.svg" 

import { useLocation } from "react-router-dom"
import { getStorage } from "../../pages/auth/auth.util"

export default function Header({ showSidebar, setShowSidebar}) {

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
            <div
                className={styles.burgerContainer}
                onClick={() => setShowSidebar(!showSidebar)}
            >
                <img src={burger} />
            </div>
            <p className={styles.title}>{currPage[pathname]}</p>

            <div className={styles.profile}>
                <img className={styles.avatar} src={avatar}/>
                <div className={styles.profileInfo}>
                    <p>{getStorage().getItem("user")}</p>
                    <p className={styles.id}>ID: <span>{getStorage().getItem("id_number")}</span></p>
                </div>
            </div>
        </div>
    )
}