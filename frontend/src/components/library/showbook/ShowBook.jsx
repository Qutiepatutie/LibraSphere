import styles from "../../../styles/userPages/library/showbook/showbook.module.css"
import close from "../../../assets/close-icon.svg"

import { useState, useEffect } from "react";

import CustomButton from "../../ui/CustomButton.jsx";
import BookInfos from "./BookInfos.jsx";

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

    const [showToast, setShowToast] = useState(false);
    
    const { allBorrowers, setAllBorrowers } = useBorrowers();
    const {
        loading,
        toastMessage,
        isEdit,
        setIsEdit,
        setToastMessage,
        borrowBook,
        editBook,
    } = useUpdateBook(setShowConfirm, notify);
    
    const isBorrowed = allBorrowers.some(
        b => b.status !== "Returned" && b.status !== "Cancelled"
        && b.book.isbn === currBook.isbn
    );

    const isAdmin = role === "admin";

    const buttonLabel = isAdmin
        ? (isEdit ? "Submit" : "Edit Book")
        : (isBorrowed ? "Borrowed" : "Borrow Book");

    useEffect(() => setBookDetails(currBook), [currBook]);

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

        const isUnchanged = Object
            .keys(bookDetails)
            .every(key => bookDetails[key] === currBook[key]);

        if(isUnchanged){
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

        setAllBorrowers(prev => 
            prev.map(b => 
                b.book.isbn === book.isbn
                    ? {...b, status: "Pending"}
                    : b
            )
        );
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
                    <img className={styles.cover} src={bookDetails.cover_url}/>
                    <div className={styles.close} onClick={() => setShowBook(false)}>
                        <img src={close} />
                    </div>

                    <div className={styles.bodyContainer}>
                        <BookInfos 
                            bookDetails={bookDetails}
                            details={details}
                            handleChange={handleChange}
                            isEdit={isEdit}

                            />

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
                                value={buttonLabel}
                                height="3em"
                                width="30%"
                                onClick={() => {
                                    if(isAdmin){
                                        return isEdit 
                                            ? handleConfirmEdit() 
                                            : setIsEdit(true)
                                        }
                                        
                                        setShowConfirm(true);
                                    }}
                                    disabled={isBorrowed && role !== "admin"}
                                    bgColor={isBorrowed && role !== "admin" ? "darkgray" : ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
