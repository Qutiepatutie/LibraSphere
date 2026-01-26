import { FormInput, PasswordInput } from "../ui/Inputs";

export default function ForgotPassword({ isEmpty, setIsEmpty, forgotPassData, setForgotPassData}) {
    
    const handleChange = (field, value) => {
        setForgotPassData(prev => ({ ...prev, [field]: value }));
        setIsEmpty(prev => ({ ...prev, [field]: false }));
    }

    return (
        <>
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
        </>
    )
}