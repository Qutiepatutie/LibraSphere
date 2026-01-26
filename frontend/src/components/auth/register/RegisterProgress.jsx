import styles from "../../../styles/components/registerprogress.module.css"

import empty from '../../../assets/auth/register/empty-register-icon.svg'
import filled from '../../../assets/auth/register/filled-register-icon.svg'

export default function RegisterProgress({ currentForm }){
    return(
        <>
            <div className={styles.container}>
                <div className={`${styles.first} ${currentForm == 1 ? styles.current : styles.filled}`}>
                    <img 
                        className={`${styles.icon} ${currentForm == 1 ? styles.inverted : ""}`}
                        src={currentForm ==1 ? empty : filled}
                    />
                </div>
                <div className={`${styles.line} ${currentForm == 2 ? styles.current : (currentForm == 3 ? styles.filled : "")}`} />

                <div className={`${styles.second} ${currentForm == 2 ? styles.current : (currentForm == 3 ? styles.filled : "")}`}>
                    <img 
                        className={`${styles.icon} ${currentForm == 2 ? styles.inverted : ""}`}
                        src={currentForm != 2 && currentForm == 3 ? filled : empty}
                    />
                </div>
                <div className={`${styles.line} ${currentForm == 3 ? styles.current : (currentForm == 3 ? styles.filled : "")}`} />

                <div className={`${styles.third} ${currentForm == 3 ? styles.current : (currentForm == 3 ? styles.filled : "")}`}>
                    <img 
                        className={`${styles.icon} ${currentForm == 3 ? styles.inverted : ""}`}
                        src={empty}
                    />
                </div>
            </div>
        </>
    )
}