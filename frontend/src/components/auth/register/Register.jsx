import First from "./First.jsx"
import Second from "./Second.jsx"
import Third from "./Third.jsx"
import RegisterProgress from "../../auth/register/RegisterProgress.jsx"

export default function Register({ isEmpty, setIsEmpty, part, registerData, setRegisterData }) {

    const handleChange = (field, value) => {
        setRegisterData(prev => ({...prev, [field]: value}));
        setIsEmpty(prev => ({...prev, [field]: false}));
    };

    return (
        <>
            <RegisterProgress currentForm={part} />
            {part === 1 && <First isEmpty={isEmpty} registerData={registerData} onChange={handleChange}/>}
            {part === 2 && <Second isEmpty={isEmpty} registerData={registerData} onChange={handleChange}/>}
            {part === 3 && <Third isEmpty={isEmpty} registerData={registerData} onChange={handleChange}/>}
        </>
    )
}