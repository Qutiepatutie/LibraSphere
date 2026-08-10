import { TextInput, Selector } from "../../ui/Inputs.jsx";
import { programs, sex } from "./register.constants.js"

export default function Second({ isEmpty, registerData, onChange }) {

    return (
        <>
            <Selector 
                placeholder="Sex"
                value={registerData.sex}
                name="sex"
                onChange={(e) => onChange("sex", e.target.value)}
                isEmpty={isEmpty.sex}
                options={sex}
            />

            <Selector 
                placeholder="Program"
                value={registerData.program}
                name="program"
                onChange={(e) => onChange("program", e.target.value)}
                isEmpty={isEmpty.program}
                options={programs}
            />

            <TextInput 
                placeholder="ID Number"
                value={registerData.id_number}
                name="student_number"
                onChange={(e) => onChange("id_number", e.target.value)}
                isEmpty={isEmpty.id_number}
            />
        </>
    )
}