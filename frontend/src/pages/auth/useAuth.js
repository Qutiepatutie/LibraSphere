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

    async function login(loginCredentials, isChecked) {
        try {
            setErrorMessage("");
            setIsLoading(true);
            const resp = await loginAPI(loginCredentials.email, loginCredentials.pass)

            if (resp.status !== 200) {
                showToastFunc(resp.message);
                return false;
            }
            
            console.log(resp.data);
            const { access, refresh, role, profile } = resp.data;
        
            localStorage.setItem("user", profile?.first_name);
            localStorage.setItem("id_number", profile?.id_number);
            localStorage.setItem("role", role);
        
            // FIX JWT IN BACKEND
             
            if(isChecked) {
                localStorage.setItem("access", access);
                localStorage.setItem("refresh", refresh);
            } else {
                sessionStorage.setItem("access", access);
                sessionStorage.setItem("refresh", refresh);
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

            if (resp.status !== 200) {
                showToastFunc(resp.message);
                return false;
            }
            
            showToastFunc(resp.message);
            setIsPassChanged(true);
            return true;
            
        } catch {
            showToastFunc("Changing the password failed. Please try again");
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
        
            if (resp.status !== 201) {
                showToastFunc(resp.message);
                return false;
            }
    
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