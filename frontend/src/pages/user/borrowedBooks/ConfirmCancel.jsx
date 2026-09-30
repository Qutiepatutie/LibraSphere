import styles from "../../../styles/userPages/borrowedBooks/confirmcancel.module.css"

import CustomButton from "../../../components/ui/CustomButton";

export default function ConfirmCancel({ setShowConfirmCancel, handleCancel }) {
    return (
        <div className={styles.backdrop} onClick={(e) => {
            e.stopPropagation();
            setShowConfirmCancel(false);
        }}>
            <div className={styles.confirmCancel} onClick={(e) => e.stopPropagation()}>
                <div className={styles.body}>
                    <p>Are you sure you want to cancel?</p>
                </div>
            
                <div className={styles.buttonContainer}>
                    <CustomButton
                        value="No"
                        action="clear"
                        onClick={() => setShowConfirmCancel(false)}
                    />
                    
                    <CustomButton
                        value="Yes"
                        action="button"
                        onClick={() => {
                            setShowConfirmCancel(false)
                            handleCancel();
                        }}
                    />
                </div>
            </div>
        </div>
    )
}