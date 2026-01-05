import { useState,useEffect } from 'react';
import { login } from '../api/users.js'

import styles from '../styles/authPage/loginform.module.css'
import FormSwitcher from './FormSwitcher'
import ForgotPassword from './ForgotPassword.jsx';

import openIcon from '../assets/eye-icon.svg';
import hideIcon from '../assets/closed-eye-icon.svg';

export default function LoginForm({onSetForm, onLogIn }) {

    const [emailInput, setEmailInput] = useState("");
    const [passInput, setPassInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [emptyEmail, setEmptyEmail] = useState(false);
    const [emptyPass, setEmptyPass] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const [message, setMessage] = useState();
    const [show, setShow] = useState(false);

    const [isForgotPass, setIsForgotPass] = useState(false);

    const notify = () => {
        setShow(true);
        setTimeout(() => setShow(false), 2000);
    };

    useEffect(() => {
        setMessage("");
        setInvalid(false);
    },[emailInput, passInput]);

    const handleLogIn = async () => {
        setInvalid(false);
        if(!emailInput || !passInput || loading){
            setEmptyEmail(!emailInput);
            setEmptyPass(!passInput);
            return;
        }

        setLoading(true);
        const data = await login(emailInput, passInput);
        setLoading(false);
        
        if(data.status == 'success'){
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("id", data.id);
            sessionStorage.setItem("user", data.user);
            sessionStorage.setItem("student_number", data.student_number);
            sessionStorage.setItem("role", data.role);

            setShowPass(false);
            setInvalid(false);
            onLogIn(true);
            setEmailInput("");
            setPassInput("");
            return;
        
        }else if(data.status == 'failed'){
            console.log(data.status);
            setMessage(data.message);
            setInvalid(true);
            return;
        }else {
            console.log(data.status);
            setMessage(data.message);
            notify();
            return;  
        }
    }

    return(
        <>
            <div className={`${styles.toast} ${show ? styles.show : ""}`}>{message}</div>
            <div className={styles.container}>

                {isForgotPass ? <ForgotPassword setIsForgotPass={setIsForgotPass} /> :
                    <>
                        <FormSwitcher onSetForm={onSetForm} isFocused = "login"/>

                        <form className={styles.form} onSubmit={(e) => {e.preventDefault(); handleLogIn;}}>
                            <label>Email</label>
                            <input className={`${styles.emailInput} ${emptyEmail ? styles.empty : ""}`}
                                    type="text"
                                    name="email"
                                    value={emailInput}
                                    onChange={(e) => {
                                        setEmailInput(e.target.value)
                                        setEmptyEmail(false);
                                    }}
                                /> 

                            <label>Password</label>
                            <div className={`${styles.passContainer} ${emptyPass ? styles.empty : ""}`}>
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    value={passInput}
                                    onChange={(e) => {
                                        setPassInput(e.target.value)
                                        setEmptyPass(false);
                                    }}
                                />
                                <img
                                    src={showPass ? openIcon : hideIcon}
                                    className={styles.showPassIcon}
                                    onClick={() => setShowPass(!showPass)}
                                />
                            </div>
                            
                            <div className={invalid ? styles.message : styles.hidden}>
                                <p>Invalid Email/Password</p>
                            </div>

                            <div className={styles.button}>
                                <div
                                    className={styles.forgotPass}
                                    onClick={() => {setIsForgotPass(true);
                                                    setEmptyEmail(false);
                                                    setEmptyPass(false);
                                                    setEmailInput("");
                                                    setPassInput("");}}>
                                        <u>Forgot Password?</u>
                                </div>

                                <button type ="submit" onClick={handleLogIn} className={styles.loginButton}>
                                    {(loading) ? "Logging in..." : "Login"}
                                </button>
                            </div>
                        </form>
                    </>
                }
            </div>
        </>
    )
}