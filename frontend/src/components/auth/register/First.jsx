import { TextInput } from "../../ui/Inputs"

export default function First({ isEmpty, registerData, onChange}) {


    return (
        <>
            <TextInput 
                placeholder="First Name"
                value={registerData.first_name}
                name="first_name"
                onChange={(e) => onChange("first_name", e.target.value)}
                isEmpty={isEmpty.first_name}      
            />

            <TextInput 
                placeholder="Middle Name"
                value={registerData.middle_name}
                name="middle_name"
                onChange={(e) => onChange("middle_name", e.target.value)} 
                isEmpty={isEmpty.middle_name}
            />

            <TextInput 
                placeholder="Last Name"
                value={registerData.last_name}
                name="last_name"
                onChange={(e) => onChange("last_name", e.target.value)} 
                isEmpty={isEmpty.last_name}
            />
        </>
    )
}