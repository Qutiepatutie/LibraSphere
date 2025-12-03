import { useEffect, useState } from 'react';

import { changePass } from '../api/users';

import styles from '../styles/authPage/forgotpass.module.css';

export default function ForgotPassword({ setIsForgotPass }){

    const initialData = {
        email: "",
        newPass: "",
        confirmNewPass: ""
    }

    const [inputs, setInputs] = useState(initialData);
    const [emptyEmail, setEmptyEmail] = useState(false);
    const [emptyNewPass, setEmptyNewPass] = useState(false);
    const [emptyConfirmNewPass, setEmptyConfirmNewPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);

    const [message, setMessage] = useState();
    const [show, setShow] = useState(false);

    const notify = () => {
        setShow(true);
        setTimeout(() => setShow(false), 2000);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        setInputs({ ...inputs, [name]: value});
    }

    useEffect(() => {
        setMessage("");
    },[inputs]);

    const handleConfirm = async (e) => {
        if(e) e.preventDefault();

        setIsValid(true);
        setMessage("");
        setEmptyEmail(!inputs.email);
        setEmptyNewPass(!inputs.newPass);

        if(!inputs.email || !inputs.newPass || !inputs.confirmNewPass){
            setEmptyEmail(!inputs.email);
            setEmptyNewPass(!inputs.newPass);
            setEmptyConfirmNewPass(!inputs.confirmNewPass);
            return;
        };

        if(inputs.newPass !== inputs.confirmNewPass){
            setMessage("Passwords must match");
            setEmptyNewPass(true);
            setEmptyConfirmNewPass(true);
            setIsValid(false);
            return;
        }

        if(inputs.email === "admin"){
            setMessage("Invalid input");
            notify();
            return;
        }

        setLoading(true);
        const data = await changePass(inputs.email, inputs.confirmNewPass);
        setLoading(false);

        if(data.status === "success"){
            setMessage(data.message);
            setInputs(initialData);
            notify();
            return;
        }else{
            setMessage(data.message);
            notify();
            return;
        }
    }

    return(
        <>
            <div className={`${styles.toast} ${show ? styles.show : ""}`}>{message}</div>

            <div className={styles.forgotPass}>
                <h1>Change Password</h1>
                <form className={styles.inputContainer} onSubmit={(e) => handleConfirm(e)}>
                    <label>Enter email</label>
                    <input 
                        type="text"
                        name="email"
                        value={inputs.email}
                        onChange={(e) => handleChange(e)}
                        className={emptyEmail ? styles.empty : ""}    
                    />
                    <label>Enter new password</label>
                    <input
                        type="password"
                        name="newPass"
                        value={inputs.newPass}
                        onChange={(e) => handleChange(e)}
                        className={emptyNewPass ? styles.empty : ""}  
                    />
                    <label>Confirm new password</label>
                    <input
                        type="password"
                        name="confirmNewPass"
                        value={inputs.confirmNewPass}
                        onChange={(e) => handleChange(e)} 
                        className={emptyConfirmNewPass ? styles.empty : ""}     
                    />

                    <div className={`${styles.invalidMessage} ${isValid ? styles.hidden : ""}`} >
                        <p>{message}</p> 
                    </div>
                    
                    <div className={styles.buttons}>
                        <p onClick={() => setIsForgotPass(false)}><u>Sign in</u></p>
                        <button onClick={handleConfirm}>{loading ? "Confirming..." : "Confirm"}</button>
                    </div>
                    
                </form>
                
            </div>
        </>
    )
}