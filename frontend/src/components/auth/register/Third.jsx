import { FormInput, PasswordInput } from "../../ui/Inputs"

export default function Third({ isEmpty, registerData, onChange }) {

    return (
        <>
            <FormInput 
                label="Email"
                value={registerData.email}
                name="email"
                onChange={(e) => onChange("email", e.target.value)}
                isEmpty={isEmpty.email}
            />        
            
            <PasswordInput 
                label="Password"
                value={registerData.password}
                name="password"
                onChange={(e) => onChange("password", e.target.value)}
                isEmpty={isEmpty.pass}
            />        
            
            <PasswordInput
                label="Confirm Password"
                value={registerData.confirm_password}
                name="confirm_password"
                onChange={(e) => onChange("confirm_password", e.target.value)}
                isEmpty={isEmpty.confirm_password}
            />        
        </>
    )
}