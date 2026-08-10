import styles from "../../styles/components/custombutton.module.css"

export default function CustomButton({ value="", type="", onClick, disabled, action}) {
    return (
        <button 
            className={`${styles.button} ${styles[action]}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {value}
        </button>
    )
}