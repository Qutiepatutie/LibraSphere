import { useState } from 'react';

import styles from '../../styles/authPage/registerForm/third.module.css'

import openIcon from '../../assets/eye-icon.svg';
import hideIcon from '../../assets/closed-eye-icon.svg';

export default function Third({ handleChange, registerData, emptyEmail, emptyPassword, emptyConfirmPassword}) {

    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

    return (
        <>
            <label>Email</label>
            <input
                type="text"
                name="email"
                value={registerData?.email}
                onChange={handleChange}
                className={emptyEmail ? styles.empty : ""}
            />

            <label>Password</label>
            <div className={styles.newPassContainer}>
                <input
                    type={showNewPass ? "text" : "password"}
                    name="password"
                    value={registerData?.password}
                    onChange={handleChange}
                    className={`${styles.newPass} ${emptyPassword ? styles.empty : ""}`}
                />
                <img
                    src={showNewPass ? openIcon : hideIcon}
                    className={styles.showPassIcon}
                    onClick={() => setShowNewPass(!showNewPass)}
                />
            </div>
            

            <label>Confirm Password</label>
            <div className={styles.confirmNewPassContainer}>
                <input
                    type={showConfirmNewPass ? "text" : "password"}
                    name="confirm_password"
                    value={registerData?.confirm_password}
                    onChange={handleChange}
                    className={`${styles.confirmNewPass} ${emptyConfirmPassword ? styles.empty : ""}`}
                />
                <img
                    src={showConfirmNewPass ? openIcon : hideIcon}
                    className={styles.showPassIcon}
                    onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}
                />
            </div>
            
        </>
    )
}