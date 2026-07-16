import styles from "../../styles/userPages/library/bookpanel.module.css"

export default function BookPanel({ setActiveBook, setShowBook, book, status = null, hover = true }) {
    return (
        <div
            className={`${styles.bookPanel} ${hover ? "" : styles.noHover}`}
            onClick={(e) => {
                e.stopPropagation();
                setActiveBook(book);
                setShowBook(true);
                }
            }
        >
            <div className={styles.cover}>
                <img src={book?.cover_url} />
                {status && 
                    <div className={`${styles.badge} ${styles[status]}`}>{status}</div>
                }
            </div>
            <p className={styles.title}>{book?.title}</p>
            <p className={styles.author}>{book?.author}</p>
        </div>
    )
}