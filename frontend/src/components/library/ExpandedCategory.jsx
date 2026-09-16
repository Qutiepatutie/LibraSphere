import styles from "../../styles/library/expandedcategory.module.css"

import { useEffect, useState } from "react";

import close from "../../assets/close-icon.svg"
import nextIcon from "../../assets/pages/library/chevron-next.svg"
import prevIcon from "../../assets/pages/library/chevron-prev.svg"

import BookPanel from "./BookPanel"

export default function ExpandedCategory({ showCategory, setShowCategory, categories, activeCategory, books, setActiveBook, showBook, setShowBook }) {

    const [currPage, setCurrPage] = useState(1);
    const headerTitle = categories.find(c => c.code === activeCategory)?.label;

    useEffect(() => {
        const handleEsc = (e) => {
            if(e.key === "Escape" && showCategory && !showBook)
                setShowCategory(false);
        }

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [showCategory, showBook]); 

    useEffect(() => {
        setCurrPage(1);
    }, [activeCategory])

    const booksPerPage = 14;
    
    const lastIndex = currPage * booksPerPage;
    const firstIndex = lastIndex - booksPerPage;

    const currentBooks = books?.slice(firstIndex, lastIndex) ?? [];
    
    const totalPages = Math.ceil(books?.length / booksPerPage);

    return (
        <div className={showCategory ? styles.backdrop : styles.hidden} onClick={() => setShowCategory(false)}>
            <div
                className={styles.expandedCategory}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                <div className={styles.header}>
                    <p className={styles.headerTitle}>{headerTitle}</p>
                    <div className={styles.close} onClick={() => setShowCategory(false)}>
                        <img src={close}/>
                    </div>
                </div>
                <div className={styles.books}>
                    {currentBooks.map((book, key) => (
                        <BookPanel 
                            key={key}                            
                            setActiveBook={setActiveBook}
                            showBook={showBook}
                            setShowBook={setShowBook}
                            book={book}
                        />
                    ))}
                </div>
                {books?.length > booksPerPage && (
                    <div className={styles.pageButtons}>
                        <button
                            onClick={() => setCurrPage(currPage - 1)}
                            disabled={currPage === 1}
                            className={styles.pageSelector}
                        >
                            <img src={prevIcon}/>
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => {
                            index += 1;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrPage(index)}
                                    className={`${styles.pageDot} ${currPage === index ? styles.active : ""}`}
                                />
                            )
                        })}
                        <button
                            onClick={() => setCurrPage(currPage + 1)}
                            disabled={currPage === totalPages}
                            className={styles.pageSelector}
                        >
                            <img src={nextIcon}/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}