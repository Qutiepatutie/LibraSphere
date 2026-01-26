import { autofillBookInfo, addBook as addBookUtil } from "../../../api/books";
import { initialFormValues } from "./addbook.constants";

import { useState } from "react";

export function useAddBook() {

    const [isAutofilling, setIsAutofilling] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookData, setBookData] = useState(initialFormValues);

    const [toastMessage, setToastMessage] = useState("");

    async function autofill(isbn) {
       
        setBookData(prev => 
            ({...prev, ...handleLoadData("Autofilling...")}));

        setIsAutofilling(true);
        try{
            const resp = await autofillBookInfo(isbn);

            if(resp.message === "No book found") {
                setBookData(prev =>
                    ({...prev, ...handleLoadData("Unknown") }));
                setToastMessage(resp.message);
                return;
            }
    
            const dateAcquired = resp.book.date_acquired.substring(0,10).trim();
    
            setBookData(prev => ({
                ...prev,
                "isbn" : isbn,
                "title" : resp.book.title,
                "author" : resp.book.author,
                "edition" : resp.book.edition,
                "description" : resp.book.description,
                "publisher" : resp.book.publisher,
                "dateAcquired" : dateAcquired,
                "yearPublished" : resp.book.year_published,
                "pages" : resp.book.pages,
                "tags" : resp.book.tags,
                "coverURL" : resp.book.cover_url
            }));

        }catch(error) {
            setToastMessage("Server Error");
            setBookData(prev => ({
                ...prev,
                ...handleLoadData("")
            }));
            return;
        }finally {
            setIsAutofilling(false);
        }
    }

    async function addBook(data) {
        setIsSubmitting(true);
        const resp = await addBookUtil(data);
        setToastMessage(resp.message);
        setIsSubmitting(false);
    }

    const handleLoadData = (value = "") => 
        Object.fromEntries(
            Object.keys(initialFormValues)
                .filter(key => ![
                                "isbn",
                                "classification",
                                "callNumber",
                                "coverURL",
                            ].includes(key))
                .map(key => [key, value])
        )

    return ({ isAutofilling, isSubmitting, bookData, toastMessage, setToastMessage, setBookData, autofill, addBook });
}