import styles from '../styles/settings.module.css'
import close from '../assets/close-icon.svg'

export default function Settings({isOpen, setIsOpen, onLogOut, setCurrentPage}){

    const handleLogOut = () => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");
        setCurrentPage("Dashboard");
        onLogOut(false);
        setIsOpen(false);
    }

    return(
        <>
            <div className={isOpen ? styles.container : styles.hidden}>
                <div className={styles.settings}>
                    <div className={styles.header}>
                        Settings
                        <img src={close} onClick={() => setIsOpen(false)}/>
                    </div>
                    <div className={styles.main}>
                        <div className={styles.placeholders}></div>
                        <div className={styles.placeholders}></div>
                        <div className={styles.placeholders}></div>
                        <button className={styles.logout} onClick={handleLogOut}>Logout</button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}