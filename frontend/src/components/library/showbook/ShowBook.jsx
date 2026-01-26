import styles from "../../../styles/userPages/library/showbook.module.css"
import close from "../../../assets/close-icon.svg"

import { useState, useEffect } from "react";

import CustomButton from "../../ui/CustomButton.jsx"

import { details } from "./showbook.constants.js"
import { useBorrowers } from "../../../hooks/useBorrowers.js";
import { useUpdateBook } from "./useUpdateBook.js";

import Toast from "../../ui/Toast.jsx"
import ConfirmBorrowPanel from "../ConfirmBorrowPanel.jsx";

export default function ShowBook({ currBook, onConfirmEdit, showBook, setShowBook }){
    if(!currBook) return null;
    const role = localStorage.getItem("role");
    
    const notify = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }
    
    const [showConfirm, setShowConfirm] = useState(false);
    const [bookDetails, setBookDetails] = useState(currBook);

    const [showToast, setShowToast] = useState("");
    
    const { allBorrowers } = useBorrowers();
    const {
        loading,
        toastMessage,
        isEdit,
        isBorrowed,
        setIsBorrowed,
        setIsEdit,
        setToastMessage,
        borrowBook,
        editBook,
    } = useUpdateBook(setShowConfirm, notify);

    useEffect(() => setBookDetails(currBook), [currBook]);
    
    useEffect(() => {
        const borrowed = allBorrowers.some(
            borrower => borrower.book.ISBN === currBook.ISBN
        );

        setIsBorrowed(borrowed);
    }, [allBorrowers, currBook]);


    useEffect(() => {
        const handleEsc = (e) => {
            if(e.key === "Escape" && showBook)
                setShowBook(false);
        }

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [showBook]); 

    const handleChange = (e) => {
        const {value, name} = e.target;
        
        setBookDetails({ ...bookDetails, [name]: value});
    }

    const handleCancelEdit = () => {
        setBookDetails(currBook);
        setIsEdit(false);
    }

    const handleConfirmEdit = async () => {
        if(JSON.stringify(bookDetails) === JSON.stringify(currBook)){
            setIsEdit(false);
            return;
        }

        editBook(bookDetails);
        onConfirmEdit(bookDetails);

        setToastMessage("Successfully Edited Book!");
        notify();

        setIsEdit(false);
    }

    const handleConfirmBorrow = (book) => {
        borrowBook(book);
    }

    return (
        <>
            <Toast message={toastMessage} show={showToast}/>
            <ConfirmBorrowPanel 
                showConfirm={showConfirm} 
                setShowConfirm={setShowConfirm}
                currBook={currBook}
                loading={loading}
                handleConfirmBorrow={handleConfirmBorrow}  
            />
            <div className={showBook ? styles.backdrop : styles.hidden} onClick={() => setShowBook(false)}>
                <div 
                    className={styles.showBook}
                    onClick={(e) => e.stopPropagation()}
                >
                    <img className={styles.cover} src={bookDetails.cover_path}/>
                    <div className={styles.close} onClick={() => setShowBook(false)}>
                        <img src={close} />
                    </div>
                    <div className={styles.infos}>
                        <div className={styles.header}>
                            <h1>{bookDetails.title}</h1>
                            <h2>{bookDetails.author}</h2>
                        </div>
                        <div className={styles.description}>
                            <textarea 
                                name="description"
                                value={bookDetails.description}
                                onChange={handleChange}
                                readOnly={!isEdit}
                                className={isEdit ? styles.edit : styles.noEdit}
                            />
                        </div>
                        <div className={styles.details}>
                            {Object.keys(details).map((key, index) => {
                                if(key === "description") return;

                                const props = {
                                    type: "text",
                                    name: key,
                                    className: isEdit ? styles.edit : styles.noEdit,
                                    readOnly: !isEdit,
                                    value: bookDetails[key],
                                    onChange: handleChange
                                }

                                return (
                                    <p key={index}>
                                        <span>{details[key]}:</span>
                                        <input 
                                            {...props}
                                        />
                                    </p>
                                )
                            })}
                        </div>
                        <div className={styles.button}>
                            {isEdit && 
                                <CustomButton 
                                    value="Cancel"
                                    height="3em"
                                    width="30%"
                                    bgColor="#ededed"
                                    color="black"
                                    onClick={handleCancelEdit}
                                />
                            }

                            <CustomButton 
                                value={role === "admin" 
                                    ? isEdit 
                                        ? "Submit" 
                                        : "Edit Book" 
                                    : isBorrowed 
                                        ? "Borrowed"
                                        : "Borrow Book"
                                    }
                                height="3em"
                                width="30%"
                                onClick={() => {
                                    if(role === "admin"){
                                        isEdit
                                        ? handleConfirmEdit()
                                        : setIsEdit(true)
                                    } else {
                                        console.log("confirm borrow")
                                        setShowConfirm(true);
                                    }
                                }}
                                disabled={isBorrowed}
                                bgColor={isBorrowed ? "darkgray" : ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
