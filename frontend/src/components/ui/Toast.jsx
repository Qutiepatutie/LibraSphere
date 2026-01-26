import styles from "../../styles/components/toast.module.css"
import { createPortal } from "react-dom";

export default function Toast({ message="", show=false }) {
    if(!show) return null;

    return createPortal(
        <div
            className={`
                ${styles.toast}
                ${show ? styles.show : ""}
            `}
        >
            {message}
        </div>,
        document.body
    );
}