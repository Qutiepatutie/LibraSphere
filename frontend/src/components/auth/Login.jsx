import styles from "../../styles/authPage/login.module.css"

import { FormInput, PasswordInput, RememberMe } from "../../components/ui/Inputs"
import CustomButton from "../ui/CustomButton";

import google from "../../assets/auth/login/google.svg";

export default function Login({ isEmpty, setIsEmpty, credentials, setCredentials, isChecked, setIsChecked, setMode, setErrorMessage, errorMessage, isLoading }) {

    const handleChange = (field, value) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
        setIsEmpty(prev => ({ ...prev, [field]: false }));
        setErrorMessage("");
    }

    return (
        <div className={styles.login}>
            <div className={styles.inputs}>
                <FormInput
                    label="Email"
                    value={credentials.email}
                    name="email"
                    onChange={(e) => handleChange("email", e.target.value)}
                    isEmpty={isEmpty.email}
                />
                
                <PasswordInput
                    label="Password"
                    value={credentials.pass}
                    name="password"
                    onChange={(e) => handleChange("pass", e.target.value)}
                    isEmpty={isEmpty.pass}
                />

            </div>
            
            <p className={styles.error}><i>{errorMessage}</i></p>

            <div className={styles.buttons}>
                <div className={styles.actionButtons}>
                    <RememberMe isChecked={isChecked} setIsChecked={setIsChecked}/>  
                    <p
                        className={styles.forgotPass}
                        onClick={() => {setMode("forgotPass")}}
                    >
                        <u>Forgot Password?</u>
                    </p>
                </div>
                <CustomButton
                    onClick={() => { }}
                    value={isLoading ? "Logging in..." : "Login"}
                    type="submit"
                    height="2.5rem"
                    width="80%"
                    borderRadius="5px"
                    disabled={isLoading}
                />
            </div>

            <div className={styles.divider}>or</div>
                
            <div className={styles.googleLogin}>
                <div className={styles.googleLoginContainer}>
                    <img src={google}/>
                    <p>Login with Google</p>
                </div>
            </div>
            
        </div>
    )
}