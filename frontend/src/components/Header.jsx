import icon from '../assets/profile-icon.svg'

export default function Header({currentPage}) {
    return (
        <>
            <div className={styles.container}>
                <div>
                    <p style={{fontSize: 25}}>{currentPage}</p>
                </div>
                <div className={styles.userContainer}>
                    <img src={icon} className={styles.icon}/>
                    <div>
                        <p>{sessionStorage.getItem("user")}</p>
                        <p className={styles.id}>ID:{sessionStorage.getItem("student_number")} </p>
                    </div>
                </div>
            </div>
        </>
    )
}