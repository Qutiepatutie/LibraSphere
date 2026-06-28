import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginAPI, changePass, register as registerAPI } from "../../api/users.js"
import { checkEmail } from "./auth.util.js";
import { routes } from "./auth.constants.js";

export function useAuth() {

    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false); 
    
    const [errorMessage, setErrorMessage] = useState("");
    
    const [isRegistered, setIsRegistered] = useState(false);
    const [isPassChanged, setIsPassChanged] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!showToast) return;
        
        const timer = setTimeout(() => {
            setShowToast(false);
            setToastMessage("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [showToast]);
    
    function showToastFunc(message) {
        setToastMessage(message);
        setShowToast(true);
    }
    
    function checkStatus(status, message) {
        if(status === "failed"){
            setErrorMessage(message);
            return false;
            
        } else if (status === "error") {
            showToastFunc(message);
            return false;
        }

        return true;
    }
    
    async function login(loginCredentials, isChecked) {
        try {
            setErrorMessage("");
            setIsLoading(true);
            const resp = await loginAPI(loginCredentials.email, loginCredentials.pass)
        
            if(!checkStatus(resp.status, resp.message)) return false;
            
            const role = resp.role;
        
            localStorage.setItem("user", resp.user);
            localStorage.setItem("id_number", resp.id_number);
            localStorage.setItem("role", role);
        
            if(isChecked) {
                localStorage.setItem("access", resp.access);
                localStorage.setItem("refresh", resp.refresh);
            } else {
                sessionStorage.setItem("access", resp.access);
                sessionStorage.setItem("refresh", resp.refresh);
            }
            
            navigate(routes[role] || "/");
        
            return true;
        } catch {
            showToastFunc("Login failed. Please try again");
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    async function forgotPass(forgotPassData) {
        setErrorMessage("");
        
        const email = forgotPassData.email.toLowerCase();

        if(email === "admin" || email === "attendance") {
            setErrorMessage("Invalid Email");
            return false;
        }

        if(forgotPassData.newPass !== forgotPassData.confirmNewPass) {
            setErrorMessage("New Passwords Must Match!");
            return false;
        }
        
        try {
            setIsLoading(true);
            const resp = await changePass(forgotPassData.email, forgotPassData.newPass);

            if (!checkStatus(resp.status, resp.message)) return false;
            
            showToastFunc(resp.message);
            setIsPassChanged(true);
            return true;
            
        } catch {
            showToastFunc("Changin the password failed. Please try again");
            return false;
            
        } finally {
            setIsLoading(false);
        }
        
    }

    async function register(registerData) {
        setErrorMessage("");
        
        if(registerData.password !== registerData.confirm_password) {
            setErrorMessage("Passwords Must Match!");
            return false;
        }

        const email = checkEmail(registerData);

        if(!email.valid) {
            setErrorMessage("Invalid Email!");
            return false;
        }

        const payload = {
            ...registerData,
            role: email.role,
            email: email.email,
        };

        try {
            setIsLoading(true);
            const resp = await registerAPI(payload);
        
            if (!checkStatus(resp.status, resp.message)) return false;
    
            showToastFunc(resp.message);
            setIsRegistered(true);
            return true;
            
        } catch {
            showToastFunc("Register failed. Please try again");
            return false;
            
        } finally {
            setIsLoading(false);
        }
    }

    return {
        showToast,
        
        // messages
        toastMessage,
        errorMessage,

        // states
        isPassChanged,
        isRegistered,
        isLoading,

        // setters
        setIsPassChanged,
        setIsRegistered,
        setErrorMessage,

        // actions
        login,
        forgotPass,
        register,
    };
}