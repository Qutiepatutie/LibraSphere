import styles from "../../styles/userPages/library/categorypanel.module.css"

import arrow from "../../assets/pages/library/arrow-right.svg"

import BookPanel from "./BookPanel";

import { useEffect, useRef, useState } from "react";

export default function CategoryPanel({ categories, books, setActiveCategory, setShowCategory, showBook, setShowBook, setActiveBook }) {
    
    const booksRefs = useRef({});
    const [overflow, setOverflow] = useState({});
    
    useEffect(() => {
        const checkOverflow = () => {
            const result = {};
    
            categories.forEach(({ code }) => {
                const el = booksRefs.current[code];
    
                if (el) {
                    result[code] = el.scrollWidth > el.clientWidth;
                }
            });
    
            setOverflow(result);
        };
    
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
    
        return () => window.removeEventListener("resize", checkOverflow);
    }, [books, categories]);

    return (
        categories.map(({code, label}, index) => (
            <div
                key={code}
                className={styles.category}
            >
                <div className={styles.categoryHeader}>
                    <p>{code} | {label}</p>
                </div>

                <div
                    ref={(el) => (booksRefs.current[code] = el)}
                    className={`${styles.books} ${overflow[code] ? styles.overflow : ""}`} id={`books-${index}`}
                >
                    {!books[code]?.length 
                        ? <p className={styles.noBooks}>No Books Available</p>
                        : (books[code]?.map((book, index) => {
                            return (
                                <BookPanel 
                                    key={index}
                                    setActiveBook={setActiveBook}
                                    showBook={showBook}
                                    setShowBook={setShowBook}
                                    book={book}
                                />
                            )
                        }))
                        
                    }
                    {overflow[code] && (
                        <div className={styles.seeMoreContainer}>
                            <div
                                className={styles.seeMore}
                                onClick={() => {
                                    setActiveCategory(code);
                                    setShowCategory(true);
                                }}
                            >
                                <img src={arrow} />
                            </div>
                            <p>See more</p>
                        </div>
                    )}
                </div>
            </div>
        )) 
    )
}