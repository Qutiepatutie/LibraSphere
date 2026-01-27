import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginAPI, changePass, register as registerAPI } from "../../api/users.js"
import { checkEmail } from "./auth.util.js";

export function useAuth(notify) {

    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [isRegistered, setIsRegistered] = useState(false);
    const [isPassChanged, setIsPassChanged] = useState(false);

    const navigate = useNavigate();

    async function login(loginCredentials) {

        setIsLoading(true);
        const resp = await loginAPI(loginCredentials.email, loginCredentials.pass)
        setIsLoading(false);

        if(resp.status === "failed"){
            setToastMessage(resp.message);
            notify();
            return false;
        }

        const role = resp.role;

        localStorage.setItem("isAuth", "true");
        localStorage.setItem("user", resp.user);
        localStorage.setItem("id_number", resp.id_number);
        localStorage.setItem("role", role);

        navigate((role) === "admin"
                ? "/admin/dashboard"
                : "/dashboard"
            );

        return true;
    }

    async function forgotPass(forgotPassData) {

        if(forgotPassData.email.toLowerCase() === "admin") {
            setToastMessage("Invalid Email");
            notify();
            return false;
        }

        if(forgotPassData.newPass !== forgotPassData.confirmNewPass) {
            setToastMessage("New Passwords Must Match");
            notify();
            return false;
        }

        setIsLoading(true);
        const resp = await changePass(forgotPassData.email, forgotPassData.newPass);
        setIsLoading(false);

        if(resp.status === "failed") {
            setToastMessage(resp.message);
            notify();
            return false;
        }

        setToastMessage(resp.message);
        setIsPassChanged(true);
        notify();
    }

    async function register(registerData) {

        if(registerData.password !== registerData.confirm_password) {
            setToastMessage("Passwords Must Match!");
            notify();
            return false;
        }

        const email = checkEmail(registerData);

        if(!email.valid) {
            setToastMessage("Invalid Email");
            notify();
            return false;
        }

        const payload = {
            ...registerData,
            role: email.role,
            email: email.email,
        };

        setIsLoading(true);
        const resp = await registerAPI(payload);
        setIsLoading(false);

        if(resp.status === "failed") {
            setToastMessage(resp.message);
            notify();
            return false;
        }

        setToastMessage(resp.message);
        setIsRegistered(true);
        notify();
    }

    return { isLoading,toastMessage, isPassChanged, isRegistered, setIsPassChanged, setIsRegistered, setToastMessage, setIsLoading, login, forgotPass, register };
}