import styles from "../../../styles/authPage/register.module.css"

import CustomButton from "../../ui/CustomButton";
import First from "./First.jsx"
import Second from "./Second.jsx"
import Third from "./Third.jsx"
import RegisterProgress from "../../auth/register/RegisterProgress.jsx"

import useForm from "../../../hooks/useForm.js";

export default function Register({ isEmpty, setIsEmpty, part, setPart, registerData, errorMessage, setRegisterData, setErrorMessage, isLoading }) {

    const { handleChange } = useForm({
        setData: setRegisterData,
        setIsEmpty,
        setErrorMessage
    })

    return (
        <div className={styles.register}>

            <div className={styles.progress}>
                <RegisterProgress currentForm={part} />
            </div>

            <div className={styles.inputs}>
                {part === 1 && <First isEmpty={isEmpty} registerData={registerData} onChange={handleChange}/>}
                {part === 2 && <Second isEmpty={isEmpty} registerData={registerData} onChange={handleChange}/>}
                {part === 3 && <Third isEmpty={isEmpty} registerData={registerData} onChange={handleChange}/>}
            </div>

            <p className={styles.error}><i>{errorMessage}</i></p>
            
            <div className={styles.buttons}>
                {part > 1 &&
                    <CustomButton
                        value="Return"
                        onClick={() => {
                            setPart(prev => Math.max(prev - 1, 1))
                            setErrorMessage("");
                        }}
                        height="2.5em"
                        type="button"
                        width="49%"
                        bgColor="lightgrey"
                        color="black"
                        borderRadius="5px"
                    />
                }
                
                <CustomButton
                    value={part == 3 ? (isLoading ? "Processing..." : "Submit") : "Next"}
                    height="2.5em"
                    type="submit"
                    width={part === 1 ? "100%" : "49%"}
                    borderRadius="5px"
                />
            </div>
        </div>
    )
}