import styles from "../../../styles/components/layout/usermenu.module.css"

import logoutIcon from "../../../assets/sidebar/logout.svg"
import avatar from "../../../assets/profile-icon.png"

import { getStorage } from "../../../pages/auth/auth.util"
import { logout } from "../../../pages/auth/auth.util"

export default function UserMenu({ setShowUserMenu }) {

    const fullName = `${getStorage().getItem("user_firstName")} ${getStorage().getItem("user_lastName")}`;
    
    return (
        <div className={styles.wrapper} onClick={() => setShowUserMenu(false)}>
            <div className={styles.userMenu} onClick={(e) => e.stopPropagation()}>
                <div className={styles.idHole} />
                <div className={styles.profile}>
                    <div className={styles.avatarContainer}>
                        <img className={styles.avatar} src={avatar}/>
                        <div className={styles.uploadImage}>Upload Image</div>
                    </div>
                    <div className={styles.infoContainer}>
                        <p className={styles.name}>{fullName}</p>
                        <p className={styles.id}><span>ID:</span> {getStorage().getItem("id_number")}</p>
                        <p className={styles.porgram}><span>Program:</span> {getStorage().getItem("program")}</p>
                    </div>
                </div>
    
                <button className={styles.logout} onClick={() => logout()}>
                    <img src={logoutIcon}/>
                    <p>Logout</p>
                </button>
            </div>
        </div>
    )
}