import styles from "../../styles/userPages/library/expandedcategory.module.css"

import { useEffect } from "react";

import close from "../../assets/close-icon.svg"

import BookPanel from "./BookPanel"

export default function ExpandedCategory({ showCategory, setShowCategory, categories, activeCategory, books, setActiveBook, showBook, setShowBook }) {

    const headerTitle = categories.find(c => c.code === activeCategory)?.label;

    useEffect(() => {
        const handleEsc = (e) => {
            if(e.key === "Escape" && showCategory && !showBook)
                setShowCategory(false);
        }

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [showCategory, showBook]); 

    return (
        <div className={showCategory ? styles.backdrop : styles.hidden} onClick={() => setShowCategory(false)}>
            <div
                className={styles.expandedCategory}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                <div className={styles.header}>
                    <h1>{headerTitle}</h1>
                    <div className={styles.close} onClick={() => setShowCategory(false)}>
                        <img src={close}/>
                    </div>
                </div>
                <div className={styles.books}>
                    {!books[activeCategory]?.length 
                    ? <h1 className={styles.noBooks}>No Books Available</h1>
                    : 
                    ( 
                        books[activeCategory]?.map((book, key) => (
                            <BookPanel 
                                key={key}                            
                                setActiveBook={setActiveBook}
                                showBook={showBook}
                                setShowBook={setShowBook}
                                book={book}
                            />
                        ))
                    )
                }
                </div>
            </div>
        </div>
    )
}