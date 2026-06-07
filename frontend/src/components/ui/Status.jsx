import styles from "../../styles/components/status.module.css";

export default function Status({ status }) {
    return (
        <div className={`${styles.status} ${styles[status]}`}>
            <p>{status}</p>
        </div>
    )
}