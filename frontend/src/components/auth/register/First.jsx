import { FormInput } from "../../ui/Inputs"

export default function First({ isEmpty, registerData, onChange}) {


    return (
        <>
            <FormInput 
                label="First Name"
                value={registerData.first_name}
                name="first_name"
                onChange={(e) => onChange("first_name", e.target.value)}
                isEmpty={isEmpty.first_name}      
            />

            <FormInput 
                label="Middle Name"
                value={registerData.middle_name}
                name="middle_name"
                onChange={(e) => onChange("middle_name", e.target.value)} 
                isEmpty={isEmpty.middle_name}
            />

            <FormInput 
                label="Last Name"
                value={registerData.last_name}
                name="last_name"
                onChange={(e) => onChange("last_name", e.target.value)} 
                isEmpty={isEmpty.last_name}
            />
        </>
    )
}