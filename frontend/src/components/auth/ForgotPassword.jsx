import styles from "../../styles/authPage/forgotpassword.module.css"

import { FormInput, PasswordInput } from "../ui/Inputs";
import CustomButton from "../ui/CustomButton.jsx"

export default function ForgotPassword({ isEmpty, setIsEmpty, forgotPassData, setForgotPassData, setErrorMessage, errorMessage, setMode, isLoading}) {
    
    const handleChange = (field, value) => {
        setForgotPassData(prev => ({ ...prev, [field]: value }));
        setIsEmpty(prev => ({ ...prev, [field]: false }));
        setErrorMessage("");
    }

    return (
        <div className={styles.forgotPass}>
            <div className={styles.inputs}>
                <FormInput 
                    label="Email"
                    value={forgotPassData.email}
                    name="email"
                    onChange={(e) => handleChange("email", e.target.value)}
                    isEmpty={isEmpty.email}
                />
                
                <PasswordInput 
                    label="New Password"
                    value={forgotPassData.newPass}
                    name="newPass"
                    onChange={(e) => handleChange("newPass", e.target.value)}
                    isEmpty={isEmpty.newPass}
                />
    
                <PasswordInput
                    label="Confirm New Password"
                    value={forgotPassData.confirmNewPass}
                    name="confirmNewPass"
                    onChange={(e) => handleChange("confirmNewPass", e.target.value)}
                    isEmpty={isEmpty.confirmNewPass}
                />
                <p className={styles.error}><i>{errorMessage}</i></p>
            </div>


            <div className={styles.buttons}>

                <p
                    className={styles.signIn}
                    onClick={() => setMode("login")}
                >
                    <u>Sign in</u>
                </p>
                
                <CustomButton
                    value={isLoading ? "Processing..." : "Reset Password"}
                    height="2.5rem"
                    width="80%"
                    borderRadius="5px"
                    disabled={isLoading}
                />
            </div>
        </div>
    )
}