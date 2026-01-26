import styles from "../../styles/components/inputs.module.css"

import { useState } from "react"

import openEye from "../../assets/auth/login/opened-eye-icon.svg"
import closedEye from "../../assets/auth/login/closed-eye-icon.svg"
import searchIcon from "../../assets/search-icon.svg"

export function FormInput({ label="", value="", name="", onChange, onBlur, disabled, isEmpty=false, width}) {
    return (
        <div className={styles.formInput} style={{width: width }}>
            {label && <label htmlFor={name}>{label}</label>}
            <input 
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={isEmpty ? styles.empty : ""}
                disabled={disabled}
            />
        </div>
    )
}

export function DescriptionInput({ label="", value="", name="", rows="", onChange, disabled, isEmpty=false, width, style}) {
    return (
        <div className={styles.descriptionInput} style={{width: width}}>
            {label && <label htmlFor={name}>{label}</label>}
            <textarea 
                name={name}
                rows={rows}
                value={value}
                onChange={onChange}
                className={isEmpty ? styles.empty : ""}
                style={style}
                disabled={disabled}
            />
        </div>
    )
}

export function Selector({ label="",value="", options, name="", onChange, disabled, isEmpty=false}) {
    return (
        <div className={styles.selector}>
            {label && <label htmlFor={name}>{label}</label>}
            <select
                name={name}
                onChange={onChange}
                value={value}
                className={isEmpty ? styles.empty : ""}
                disabled={disabled}
            >
                <option value="" disabled hidden></option>
                {options?.map((option, index) => {
                    const isObject = typeof option === "object";

                    const optionCode = isObject ? option.code : option;
                    const optionLabel = isObject 
                        ? `${option.code} - ${option.label}`
                        : option;  

                    return (
                        <option key={index} value={optionCode}>{optionLabel}</option>
                    )
                })}
            </select>
        </div>
    )
}

export function PasswordInput({ label="", value="", name="", onChange, isEmpty=false }) {
    const [showPass, setShowPass] = useState(false);

    return (
        <div className={styles.formInputPass}>
            {label && <label htmlFor={name}>{label}</label>}
            <div className={`${styles.passContainer} ${isEmpty ? styles.empty : ""}`}>
                <input 
                    type={showPass ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                />
            
                <img
                    src={showPass ? openEye : closedEye}
                    onClick={() => setShowPass(!showPass)}
                />
            </div>
        </div>
    )
}

export function SearchBar({ label="", value="", name="", placeholder="", onChange, onClick, style }) {
    return (
        <div className={styles.searchBar} style={style} >
            {label && <label htmlFor={name}>{label}</label>}
            <div className={styles.searchContainer}>
                <img 
                    src={searchIcon}
                    onClick={onClick}
                />
                <input 
                    type="text"
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}