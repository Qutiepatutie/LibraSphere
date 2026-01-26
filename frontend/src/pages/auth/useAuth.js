
import { login as loginAPI, changePass, register as registerAPI } from "../../api/users.js"
import { checkEmail } from "./auth.util.js";

export function useAuth(setToastMessage) {

    async function login(loginCredentials) {

        const resp = await loginAPI(loginCredentials.email, loginCredentials.pass)
        
        if(resp.status === "failed"){
            setToastMessage(resp.message);
            return false;
        }

        const role = resp.role;

        localStorage.setItem("isAuth", true);
        localStorage.setItem("user", resp.user);
        localStorage.setItem("id_number", resp.id_number);
        localStorage.setItem("role", role);
        return true;
    }

    async function forgotPass(forgotPassData) {

        if(forgotPassData.email.toLowerCase() === "admin") {
            setToastMessage("Invalid Email");
            return false;
        }

        if(forgotPassData.newPass !== forgotPassData.confirmNewPass) {
            setToastMessage("New Passwords Must Match");
            return false;
        }

        const resp = await changePass(forgotPassData.email, forgotPassData.newPass);

        if(resp.status === "failed") {
            setToastMessage(resp.message);
            return false;
        }

        setToastMessage(resp.message);
        return true;

    }

    async function register(registerData) {

        if(registerData.password !== registerData.confirm_password) {
            setToastMessage("Passwords Must Match!");
            return false;
        }

        const email = checkEmail(registerData);

        if(!email.valid) {
            setToastMessage("Invalid Email");
            return false;
        }

        const payload = {
            ...registerData,
            role: email.role,
            email: email.email,
        };

        const resp = await registerAPI(payload);

        if(resp.status === "failed") {
            setToastMessage(resp.message);
            return false;
        }

        setToastMessage(resp.message);
        return true;

    }

    return { login, forgotPass, register };
}