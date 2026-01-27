import styles from "../../styles/authPage/auth.module.css"

import { useState, useEffect } from "react"

import Switcher from "../../components/auth/register/Switcher.jsx"
import Login from "../../components/auth/Login.jsx"
import Register from "../../components/auth/register/Register.jsx"
import ForgotPassword from "../../components/auth/ForgotPassword.jsx"
import CustomButton from "../../components/ui/CustomButton.jsx"
import Toast from "../../components/ui/Toast.jsx"

import { useAuth } from "./useAuth.js"
import {
    initialLoginCredentials,
    initialForgotPassData,
    initialRegisterData,
    initialLoginErrors,
    initialForgotPassErrors,
    initialRegisterErrors,
    fieldsByPart
} from "./auth.constants.js";

export default function AuthPage() {
   
    const [showToast, setShowToast] = useState(false);
    
    const [mode, setMode] = useState("login");
    const [part, setPart] = useState(1);
    
    const [loginCredentials, setLoginCredentials] = useState(initialLoginCredentials);
    const [forgotPassData, setForgotPassData] = useState(initialForgotPassData);
    const [registerData, setRegisterData] = useState(initialRegisterData);
    const [loginErrors, setLoginErrors] = useState(initialLoginErrors);
    const [forgotPassErrors, setForgotPassErrors] = useState(initialForgotPassErrors);
    const [registerErrors, setRegisterErrors] = useState(initialRegisterErrors);

    const isAuth = localStorage.getItem("isAuth") === "true";
    
    const notify = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }

    const {
        isLoading,
        toastMessage,
        isPassChanged,
        isRegistered,
        setIsPassChanged,
        setIsRegistered,
        setToastMessage,
        login,
        forgotPass,
        register
    } = useAuth(notify);

    useEffect(() => {
        setPart(1);
        setLoginCredentials(initialLoginCredentials);
        setForgotPassData(initialForgotPassData)
        setRegisterData(initialRegisterData);
        setLoginErrors(initialLoginErrors);
        setForgotPassErrors(initialForgotPassErrors);
        setRegisterErrors(initialRegisterErrors);
    }, [mode, isAuth]);

    useEffect(() => {
        if(!isPassChanged) return;

        setForgotPassData(initialForgotPassData);
        setIsPassChanged(false);
    }, [isPassChanged]);

    useEffect(() => {
        if(!isRegistered) return;

        setRegisterData(initialRegisterData);
        setPart(1);
        setIsRegistered(false);
    }, [isRegistered]);

    const handleLogin = () => {
        const empty = {
            email: !loginCredentials.email.trim(),
            pass: !loginCredentials.pass.trim(),
        }
        
        if(Object.values(empty).some(Boolean)){
            setLoginErrors(empty);
            return;
        }

        login(loginCredentials);
    }

    const handleForgotPassword = () => {
        const empty = {
            email: !forgotPassData.email.trim(),
            newPass: !forgotPassData.newPass.trim(),
            confirmNewPass: !forgotPassData.confirmNewPass.trim(),
        }
        
        if(Object.values(empty).some(Boolean)){
            setForgotPassErrors(empty);
            return;
        }
        
        forgotPass(forgotPassData);
    }

    const handleRegister = () => { 
        const fields = fieldsByPart[part];
        let empty = {};

        fields.forEach(field => {
            empty[field] = !registerData[field]?.trim();
        });
        
        setRegisterErrors(prev => {
            const next = { ...prev };

            Object.keys(next).forEach(key => next[key] = false);

            fields.forEach(field => {
                next[field] = empty[field];
            });

            return next;
        })
        
        if(Object.values(empty).some(Boolean)) return;

        if(part === 2 && registerData.student_number.length !== 11) {
            setToastMessage("Student Number Must be 11 digits");
            notify(); 
            return;
        }

        if(part < 3){
            setPart(part+1);
            return;
        }

        register(registerData);
    }

    const submitHandler = {
        login: handleLogin,
        register: handleRegister,
        forgotPass: handleForgotPassword,
    }
    
    return (
        <>
            <div className={styles.container}>
                <Toast message={toastMessage} show={showToast}/>
                <form
                    className={styles.formContainer}
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitHandler[mode]();
                    }}
                >
                    <div className={styles.group}>
                        {mode !== "forgotPass" ?
                            <>
                                <p className={styles.header}>LibraSphere</p>
                                <Switcher
                                    option={mode}
                                    setOption={setMode}
                                    options={[ "Login", "Register" ]}
                                />
                            </>
                            :
                            <p className={styles.header}>Reset Password</p>
                        }

                    </div>

                    <div className={styles.group}>
                        {mode === "login" &&
                            <Login
                                isEmpty={loginErrors}
                                setIsEmpty={setLoginErrors}
                                credentials={loginCredentials}
                                setCredentials={setLoginCredentials}
                            />
                        }
                        {mode === "register" &&
                            <Register
                                isEmpty={registerErrors}
                                setIsEmpty={setRegisterErrors}
                                part={part}
                                registerData={registerData}
                                setRegisterData={setRegisterData}
                            />
                        }
                        {mode === "forgotPass" && 
                            <ForgotPassword
                                isEmpty={forgotPassErrors}
                                setIsEmpty={setForgotPassErrors}
                                forgotPassData={forgotPassData}
                                setForgotPassData={setForgotPassData}
                            />
                        }
                    </div>

                    <div className={styles.group}>
                        {mode !== "register" &&
                            <p
                                className={styles.forgotPass}
                                onClick={() => {
                                    setMode(mode === "login" ? "forgotPass" : "login");
                                }}
                            >
                                <u>{mode === "login" ? "Forgot Password?" : "Sign in"}</u>
                            </p>
                        }

                        <div className={styles.buttons}>
                            {mode === "register" && part > 1 &&
                                <CustomButton
                                    value="Return"
                                    type="button"
                                    height="3em"
                                    width="40%"
                                    bgColor="lightgrey"
                                    color="black"
                                    onClick={() => setPart(part === 2 ? 1 : 2 )}
                                />    
                            }

                            <CustomButton
                                value={
                                    mode === "login" 
                                    ? isLoading ? "Logging in..." : "Sign in" 
                                    : mode === "forgotPass" 
                                    ? isLoading ? "Changing Password..." : "Submit" 
                                    : part === 3 
                                    ? isLoading ? "Registering..." : "Submit" 
                                    : "Next"
                                }
                                type="submit"
                                height="3em"
                                width={part === 1 ?  "80%" : "40%"}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}