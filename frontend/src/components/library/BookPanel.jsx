import styles from "../../styles/userPages/library/bookpanel.module.css"

export default  function BookPanel({ setActiveBook, setShowBook, book }) {
    return (
        <div
            className={styles.bookPanel}
            onClick={(e) => {
                e.stopPropagation();
                setActiveBook(book);
                setShowBook(true);
                }
            }
        >
            <img className={styles.cover} src={book.cover_path}/>
            <p className={styles.title}>{book.title}</p>
            <p className={styles.author}>{book.author}</p>
        </div>
    )
}