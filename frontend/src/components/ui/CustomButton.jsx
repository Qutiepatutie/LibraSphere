import styles from "../../styles/components/custombutton.module.css"

export default function CustomButton({ value="", type="", height="", onClick, width="", borderRadius="", bgColor="", color="", disabled}) {
    return (
        <button 
            className={styles.button}
            onClick={onClick}
            type={type}
            style={{ height: height, width: width, borderRadius: borderRadius, backgroundColor: bgColor, color:color}}
            disabled={disabled}
        >
            {value}
        </button>
    )
}