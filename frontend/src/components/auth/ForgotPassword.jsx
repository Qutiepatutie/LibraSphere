import styles from "../../styles/authPage/forgotpassword.module.css";

import CustomButton from "../ui/CustomButton.jsx";
import { TextInput, PasswordInput } from "../ui/Inputs";
import useForm from "../../hooks/useForm.js";

export default function ForgotPassword({ isEmpty, setIsEmpty, forgotPassData, setForgotPassData, setErrorMessage, errorMessage, handleSwitch, isLoading}) {

    const { handleChange } = useForm({
        setData: setForgotPassData,
        setIsEmpty,
        setErrorMessage
    });

    return (
        <div className={styles.forgotPass}>
            <div className={styles.inputs}>
                <TextInput 
                    placeholder="Email"
                    value={forgotPassData.email}
                    name="email"
                    onChange={(e) => handleChange("email", e.target.value)}
                    isEmpty={isEmpty.email}
                />
                
                <PasswordInput 
                    placeholder="New Password"
                    value={forgotPassData.newPass}
                    name="newPass"
                    onChange={(e) => handleChange("newPass", e.target.value)}
                    isEmpty={isEmpty.newPass}
                />
    
                <PasswordInput
                    placeholder="Confirm New Password"
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
                    onClick={() => handleSwitch("login")}
                >
                    <u>Sign in</u>
                </p>
               
                <div className={styles.submitButton}>
                    <CustomButton
                        value={isLoading ? "Processing..." : "Reset Password"}
                        disabled={isLoading}
                    />
                </div> 
            </div>
        </div>
    )
}