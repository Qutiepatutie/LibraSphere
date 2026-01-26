import { useState, useEffect } from "react"

import Switcher from "../../auth/register/Switcher.jsx"
import { FormInput, Selector } from "../../ui/Inputs.jsx";
import { programs } from "./register.constants.js"

export default function Second({ isEmpty, registerData, onChange }) {
    
    const [sex, setSex] = useState("male");

    useEffect(() => {
        onChange("sex", sex);
    }, [sex]);

    return (
        <>
            <p
                style={{height:"1.05em", marginLeft:"12%", alignSelf:"flex-start", fontWeight: "600"}}
            >
                Sex
            </p>
            <Switcher
                option={sex}
                setOption={setSex}
                options={[ "Male", "Female" ]}
                width="80%"
                height="2.5em"
                outline="2px solid #AAAAAA"
                borderRadius="7px"
            />

            <Selector 
                label="Program"
                value={registerData.program}
                name="program"
                onChange={(e) => onChange("program", e.target.value)}
                isEmpty={isEmpty.program}
                options={programs}
            />

            <FormInput 
                label="Student Number"
                value={registerData.student_number}
                name="student_number"
                onChange={(e) => onChange("student_number", e.target.value)}
                isEmpty={isEmpty.student_number}
            />
        </>
    )
}