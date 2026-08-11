import styles from "../../styles/userPages/library/confirmborrowpanel.module.css"

import CustomButton from "../../components/ui/CustomButton.jsx"

export default function ConfirmBorrowPanel({ showConfirm, setShowConfirm, currBook, loading, handleConfirmBorrow}) {
    return (
        <div className={showConfirm ? styles.backdrop : styles.hidden} onClick={() => setShowConfirm(false)}>
            <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
                <h2>Are you sure you want to borrow this book?</h2>
                <img className={styles.cover} src={currBook.cover_url}/>
                <div className={styles.details}>
                    <p><span>TITLE:</span><span>{currBook.title}</span></p>
                    <p><span>AUTHOR:</span><span>{currBook.author}</span></p>
                    <p><span>ISBN:</span><span>{currBook.isbn}</span></p>
                </div>
                <div className={styles.buttons}>
                    <CustomButton 
                        value="Cancel"
                        type="button"
                        action="cancel"
                        onClick={() => setShowConfirm(false)}
                    />
                    <CustomButton 
                        value={loading ? "Borrowing" : "Confirm"}
                        type="button"
                        disabled={loading}
                        onClick={() => handleConfirmBorrow(currBook)}
                    />
                </div>
            </div>
        </div>
    )
}