import styles from "../../styles/authPage/auth.module.css"

import { useState, useEffect } from "react"

import Switcher from "../../components/auth/register/Switcher.jsx"
import Login from "../../components/auth/Login.jsx"
import Register from "../../components/auth/register/Register.jsx"
import ForgotPassword from "../../components/auth/ForgotPassword.jsx"
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

    const [mode, setMode] = useState("login");
    const [part, setPart] = useState(1);

    const [loginCredentials, setLoginCredentials] = useState(initialLoginCredentials);
    const [forgotPassData, setForgotPassData] = useState(initialForgotPassData);
    const [registerData, setRegisterData] = useState(initialRegisterData);
    const [loginErrors, setLoginErrors] = useState(initialLoginErrors);
    const [forgotPassErrors, setForgotPassErrors] = useState(initialForgotPassErrors);
    const [registerErrors, setRegisterErrors] = useState(initialRegisterErrors);

    const [isRememberMeChecked, setisRememberMeChecked] = useState(false);

     const {
        isLoading,
        toastMessage,
        errorMessage,
        isPassChanged,
        isRegistered,
        setIsPassChanged,
        setIsRegistered,
        setErrorMessage,
        login,
        forgotPass,
        register,
        showToast,
    } = useAuth();

    useEffect(() => {
        setPart(1);
        setErrorMessage("");
        setLoginCredentials(initialLoginCredentials);
        setForgotPassData(initialForgotPassData)
        setRegisterData(initialRegisterData);
        setLoginErrors(initialLoginErrors);
        setForgotPassErrors(initialForgotPassErrors);
        setRegisterErrors(initialRegisterErrors);
    }, [mode]);

    useEffect(() => {
        if (!isPassChanged) return;

        setForgotPassData(initialForgotPassData);
        setIsPassChanged(false);
    }, [isPassChanged]);

    useEffect(() => {
        if (!isRegistered) return;

        setRegisterData(initialRegisterData);
        setPart(1);
        setIsRegistered(false);
    }, [isRegistered]);

    const handleLogin = () => {
        const empty = {
            email: !loginCredentials.email.trim(),
            pass: !loginCredentials.pass.trim(),
        }
        
        if (Object.values(empty).some(Boolean)) {
            setErrorMessage("Fill in important fields!");
            setLoginErrors(empty);
            return;
        }

        login(loginCredentials, isRememberMeChecked);
    }

    const handleForgotPassword = () => {
        const empty = {
            email: !forgotPassData.email.trim(),
            newPass: !forgotPassData.newPass.trim(),
            confirmNewPass: !forgotPassData.confirmNewPass.trim(),
        }
        
        if(Object.values(empty).some(Boolean)){
            setErrorMessage("Fill in important fields!");
            setForgotPassErrors(empty);
            return;
        }

        forgotPass(forgotPassData);
    }

    const handleRegister = () => {
        const fields = fieldsByPart[part];
        let empty = {};
        setErrorMessage("");

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
        
        if (Object.values(empty).some(Boolean)) {
            setErrorMessage("Fill in important fields!")
            return;
        }

        if(part === 2 && registerData.id_number.length !== 11) {
            setRegisterErrors(prev => ({ ...prev, id_number: true }));
            setErrorMessage("Student Number must be 11 digits!");
            return;
        }

        if (part !== 3) {
            setPart(prev => Math.min(prev + 1, 3));
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
                <Toast message={toastMessage} show={showToast} />
                <form
                    className={styles.formContainer}
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitHandler[mode]();
                    }}
                >
                    <div className={styles.group}>
                        {mode !== "forgotPass" ?
                                <Switcher
                                    option={mode}
                                    setOption={setMode}
                                    options={[ "Login", "Register" ]}
                                    width="70%"
                                />
                            :
                                <p className={styles.resetPassHeader}>Reset Password</p>
                        }

                    </div>

                    <div className={styles.group}>
                        {mode === "login" && 
                            <Login
                                isEmpty={loginErrors}
                                setIsEmpty={setLoginErrors}
                                credentials={loginCredentials}
                                setCredentials={setLoginCredentials}
                                isRememberMeChecked={isRememberMeChecked}
                                setisRememberMeChecked={setisRememberMeChecked}
                                setMode={setMode}
                                setErrorMessage={setErrorMessage}
                                errorMessage={errorMessage}
                                isLoading={isLoading}
                            />
                        }
                        {mode === "register" &&
                            <Register
                                isEmpty={registerErrors}
                                setIsEmpty={setRegisterErrors}
                                part={part}
                                setPart={setPart}
                                registerData={registerData}
                                errorMessage={errorMessage}
                                setRegisterData={setRegisterData}
                                setErrorMessage={setErrorMessage}
                                isLoading={isLoading}
                            />
                        }
                        {mode === "forgotPass" &&
                            <ForgotPassword
                                isEmpty={forgotPassErrors}
                                setIsEmpty={setForgotPassErrors}
                                forgotPassData={forgotPassData}
                                setForgotPassData={setForgotPassData}
                                setErrorMessage={setErrorMessage}
                                errorMessage={errorMessage}
                                setMode={setMode}
                                isLoading={isLoading}
                            />
                        }
                    </div>
                </form>
            </div>
        </>
    )
}