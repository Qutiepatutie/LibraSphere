import { useState } from "react";
import { borrowBook as borrowBookUtil, editBook as editBookUtil } from "../../../api/books";

export function useUpdateBook(setShowConfirm, notify) {
    
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [isEdit, setIsEdit] = useState(false);
    
    const [isBorrowed, setIsBorrowed] = useState(false); 

    async function editBook(bookDetails) {
        
        const resp = await editBookUtil(bookDetails);
        
        if(resp.status === "failed") {
            setToastMessage(resp.message);
            return;
        }

        setToastMessage("Successfully edited book");
        setIsEdit(false);
    }

    async function borrowBook(book) {
        const data = {
            ISBN: book.ISBN,
            id_number: localStorage.getItem("id_number")
        }

        setLoading(true);
        const resp = await borrowBookUtil(data);
        setToastMessage(resp.message);
        setLoading(false);

        if(resp.status === "success") {
            setIsBorrowed(prev => ({...prev, book}));
            setShowConfirm(false)
        }
        notify()
    }

    return { loading, toastMessage, isEdit, isBorrowed, setIsBorrowed,setIsEdit, setToastMessage, borrowBook, editBook };
}