import { FormInput, PasswordInput } from "../../components/ui/Inputs"

export default function Login({ isEmpty, setIsEmpty, credentials, setCredentials }) {

    const handleChange = (field, value) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
        setIsEmpty(prev => ({...prev, [field]: false}));
    }

    return (
        <>
            <FormInput
                label="Email"
                value={credentials.email}
                name="email"
                onChange={(e) => handleChange("email", e.target.value)}
                isEmpty={isEmpty.email}
            />
            
            {/* GAP */}
            <div style={{width: "100%", height: "1em"}}/>
            
            <PasswordInput
                label="Password"
                value={credentials.pass}
                name="password"
                onChange={(e) => handleChange("pass", e.target.value)}
                isEmpty={isEmpty.pass}
            />
        </>
    )
}