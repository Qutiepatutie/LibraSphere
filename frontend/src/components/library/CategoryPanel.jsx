import styles from "../../styles/userPages/library/categorypanel.module.css"
import expand from "../../assets/pages/library/expand-icon.svg"

import BookPanel from "./BookPanel";

export default function CategoryPanel({ categories, books, setActiveCategory, setShowCategory, showBook, setShowBook, setActiveBook }) {

    const handleScroll = (e) => {
        e.currentTarget.scrollLeft += e.deltaY * 2;
    }

    return (
        categories.map(({code, label}, index) => (
            <div
                key={code}
                className={styles.category}
                onClick={() => {
                        setActiveCategory(code);
                        setShowCategory(true);
                    }}>
                <div className={styles.categoryHeader}>
                    <p>{code} | {label}</p>
                    <img src={expand} className={styles.expandIcon}/>
                </div>
                
                <div className={styles.books} id={`books-${index}`} onWheel={handleScroll}>
                    {!books[code]?.length 
                        ? <h1 className={styles.noBooks}>No Books Available</h1>
                        : (books[code]?.map((book, index) => (
                            <BookPanel 
                                key={index}
                                setActiveBook={setActiveBook}
                                showBook={showBook}
                                setShowBook={setShowBook}
                                book={book}
                            />
                        )))
                    }
                </div>
            </div>
        )) 
    )
}
