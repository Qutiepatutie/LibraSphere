import styles from "../../styles/authPage/auth.module.css"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import Switcher from "../../components/auth/register/Switcher.jsx"
import Login from "../../components/auth/Login.jsx"
import Register from "../../components/auth/register/Register.jsx"
import ForgotPassword from "../../components/auth/ForgotPassword.jsx"
import Toast from "../../components/ui/Toast.jsx"

import { useAuth } from "./useAuth.js"
import { checkEmail, getStorage, restoreSession } from "./auth.util.js"
import {
    initialLoginCredentials,
    initialForgotPassData,
    initialRegisterData,
    initialLoginErrors,
    initialForgotPassErrors,
    initialRegisterErrors,
    fieldsByPart,
    routes,
} from "./auth.constants.js";

export default function AuthPage() {

    const [mode, setMode] = useState("login");
    const [part, setPart] = useState(1);

    // Form data
    const [loginCredentials, setLoginCredentials] = useState(initialLoginCredentials);
    const [forgotPassData, setForgotPassData] = useState(initialForgotPassData);
    const [registerData, setRegisterData] = useState(initialRegisterData);

    // Errors
    const [loginErrors, setLoginErrors] = useState(initialLoginErrors);
    const [forgotPassErrors, setForgotPassErrors] = useState(initialForgotPassErrors);
    const [registerErrors, setRegisterErrors] = useState(initialRegisterErrors);

    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

     const {
        showToast,

        // messages
        toastMessage,
        errorMessage,

        // states
        isLoading,

        // setters
        setErrorMessage,

        // actions
        login,
        forgotPass,
        register,
    } = useAuth();

    // Check if user is remembered
    useEffect(() => {
        async function checkLogin() {
            const success = await restoreSession();

            if (success) {
                const role = getStorage().getItem("role");

                navigate(routes[role], {replace: true});
            }
        }
        checkLogin();
    }, []);

    // Reset fields on mode change (Login/Register)
    function handleSwitch(mode){
        setMode(mode);
        setPart(1);
        setErrorMessage("");
        setLoginCredentials(initialLoginCredentials);
        setForgotPassData(initialForgotPassData)
        setRegisterData(initialRegisterData);
        setLoginErrors(initialLoginErrors);
        setForgotPassErrors(initialForgotPassErrors);
        setRegisterErrors(initialRegisterErrors);
    };

    // Initialize mapping the empty fields
    function buildMissingFields(fields, data) {
        const missingFields = {}

        fields.forEach(field => {
            missingFields[field] = !data[field]?.trim();
        })

        return missingFields;
    }

    // Check for empty fields
    function checkFields(fields) {
        if (Object.values(fields).some(Boolean)) {
            setErrorMessage("Fill in important fields!");
            return false;
        }
        return true;
    }

    const handleLogin = async () => {
        const missingFields =
            buildMissingFields(Object.keys(loginCredentials), loginCredentials);

        setLoginErrors(missingFields);
        
        if (!checkFields(missingFields)) {
            return;
        }

        await login(loginCredentials, rememberMe);
    }

    const handleForgotPassword = async () => {
        setErrorMessage("");

        const missingFields =
            buildMissingFields(Object.keys(forgotPassData), forgotPassData);
        
        setForgotPassErrors(missingFields);

        // Check for empty fields
        if (!checkFields(missingFields)) {
            return;
        }

        const email = forgotPassData.email.toLowerCase();

        // Check for restricted email
        if(email.includes("admin") || email === "attendance") {
            setErrorMessage("Invalid Email");
            return;
        }

        // Check matching passwords
        if(forgotPassData.newPass !== forgotPassData.confirmNewPass) {
            setErrorMessage("New Passwords Must Match!");
            return;
        }
        
        const passChanged = await forgotPass(forgotPassData);
        
        if (passChanged) {
            setForgotPassData(initialForgotPassData);
            setMode("login");
        }
    }

    const handleRegister = async () => {
        setErrorMessage("");
        const fields = fieldsByPart[part];

        const missingFields =
            buildMissingFields(fields, registerData);

        setRegisterErrors(missingFields);
        
        if (!checkFields(missingFields)) {
            return;
        }

        // Check ID Number
        if(part === 2 && registerData.id_number.length !== 11) {
            setRegisterErrors(prev => ({ ...prev, id_number: true }));
            setErrorMessage("ID Number must be 11 digits!");
            return;
        }

        // Check if email is valid
        const email = checkEmail(registerData);
        
        if (part === 3 && !email.valid) {
            setRegisterErrors(prev => ({ ...prev, email: true }));
            setErrorMessage("Invalid Email!");
            return;
        }

        // Check passwords
        if (part === 3 && (registerData.password !== registerData.confirm_password)) {
            setErrorMessage("Passwords Must Match!");
            return;
        }
        
        // Constrain part numbers
        if (part !== 3) {
            setPart(prev => Math.min(prev + 1, 3));
            return;
        }
        
        const payload = {
            ...registerData,
            role: email.role,
        }
        
        const registered = await register(payload);
        
        if (registered) {
            setRegisterData(initialRegisterData);
            setPart(1);
        }
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
                                    handleSwitch={handleSwitch}
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
                                rememberMe={rememberMe}
                                setRememberMe={setRememberMe}
                                handleSwitch={handleSwitch}
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
                                handleSwitch={handleSwitch}
                                isLoading={isLoading}
                            />
                        }
                    </div>
                </form>
            </div>
        </>
    )
}