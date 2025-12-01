import { useState,useEffect, useRef } from "react"

import styles from "../styles/addbooks.module.css"

import { autofillBookInfo, addBook } from "../api/books";

export default function AddBooks() {

    const initialBookData = {
        isbn: "",
        title: "",
        author: "",
        edition: "",
        description: "",
        publisher: "",
        yearPublished: "",
        dateAcquired: "",
        pages: "",
        callNumber: "",
        classification: "",
        tags: [], 
        coverURL: "None"
    };
    
    const createEmptyFields = () => 
        Object.fromEntries(Object.keys(initialBookData)
                            .filter(key => key !== "coverURL")
                            .map(key => [key, false]));

    const [bookData, setBookData] = useState(initialBookData);
    const [emptyFields, setEmptyFields] = useState(createEmptyFields());
    const [invalidISBN, setInvalidISBN] = useState(false);
    const [autofilled, setAutofilled] = useState(false);
    const [validCover, setValidCover] = useState(false);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [show, setShow] = useState(false);
    const [error, setError] = useState(false);

    // Message pop up
    const notify = () => {
        setShow(true);
        setTimeout(() => setShow(false), 2000);
    };

    // Clear fields
    const handleClear = () => {
        setInvalidISBN(false);
        setEmptyFields(createEmptyFields());
        setBookData(initialBookData);
        setAutofilled(false);
        setValidCover(false);
    }

    // Change values of fields
    const handleChange = (e) => {
        const {name, value} = e.target;

        setBookData({ ...bookData, [name]: value});
        console.log(value);

        if(name === "isbn") setAutofilled(false);
        if(name === "classification") handleCallNumber(
                                        value,
                                        bookData.author,
                                        bookData.yearPublished
                                    );

        setEmptyFields(prev => ({ ...prev, [name]: !value.trim()}));
    }

    // Autofill indicator
    const handleLoadData = (value = "") =>
        Object.fromEntries(Object
                            .keys(initialBookData)
                            .filter(key => !["isbn",
                                            "classification",
                                            "callNumber",
                                            "coverURL"].includes(key))
                            .map(key => [key, value]));

    // Autofill fields
    const handleAutoFill = async (e) => {
        try{
            if(!e.value.trim() || autofilled){
                setInvalidISBN(false);
                return
            }
            if(isNaN(Number(e.value)) || (e.value.length !== 10 && e.value.length !== 13)){
                setInvalidISBN(true);
                return;
            }

            setLoading(true);
            setInvalidISBN(false);
            setBookData(handleLoadData("Autofilling..."));

            const data = await autofillBookInfo(e.value);

            if(data.message === "no book found"){
                setBookData(handleLoadData("Unknown"));
                console.log(data.message);
                return;
            }

            const updatedData = {
                ...bookData,
                "title": data.title,
                "author": data.author,
                "edition": data.edition,
                "description": data.description,
                "publisher": data.publisher,
                "yearPublished": data.year_published,
                "dateAcquired": data.date_acquired,
                "pages": data.pages,
                "tags" : data.tags,
                "coverURL" : data.book_cover_url
            };

            setBookData(updatedData);
            setEmptyFields(handleEmptyFields(updatedData));
            setAutofilled(true);
            setLoading(false); 
        }catch {
            setConfirmMessage("Connection to server failed");
            setBookData(initialBookData);
            notify();
        }
        
    }

    // Check valid cover image
    useEffect(() => {
        const checkCover = async () => {
            const url = bookData.coverURL;

            if(!url || url === "None" || !autofilled){
                setValidCover(false);
                return;
            }

            const res = await fetch(url);
            const blob = await res.blob();

            if (blob.size < 2000) {
                setBookData({ ...bookData, "coverURL": "None" })
                setValidCover(false);
            } else {
                setValidCover(true);
            }
        };

        const delay = setTimeout(checkCover, 100);
        return () => clearTimeout(delay);

    }, [bookData.coverURL, autofilled]);

    // Autofill simplified call number
    const handleCallNumber = (classificationCode, authorName, year) => {
        if (!classificationCode || !authorName || !year) return;

        const lastName = authorName.trim().split(" ").pop().toLowerCase();
        const firstLetter = lastName[0].toUpperCase();

        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const getVal = (ch) => {
            if(!ch || alphabet.indexOf(ch) === -1) return "";
            const index = alphabet.indexOf(ch) + 1;
            return index < 10 ? index : Math.ceil(index/10);
        }

        const second = getVal(lastName[1]);
        const third = getVal(lastName[2]);
        const fourth = getVal(lastName[3]);

        const numericCode = `${second}${third}${fourth}`;

        // Return Dewey-style call number
        setBookData(prev => {
            const callNum = {...prev, callNumber: `${classificationCode}.${firstLetter}${numericCode} ${year}`};
            setEmptyFields(handleEmptyFields(callNum));
            return callNum
        });
    }

    // Checks Empty Fields
    const handleEmptyFields = (data = bookData) => {
        return Object.fromEntries(
                Object.entries(data)
                    .filter(key => key !== "coverURL")
                    .map(([key, value]) => [key, (value === "" || (Array.isArray(value) && value.length === 0))])
                );
    };
    
    const confirmRef = useRef(null);

    const openPopUp = () => confirmRef.current?.showModal();
    const closePopUp = () => {confirmRef.current?.close(); setOpen(false);}

    // Check book infos
    const handleCheckFields = () => {

        const empty = handleEmptyFields(bookData)
        setEmptyFields(empty);

        const hasEmpty = Object.values(empty).some(v => v === true);

        if(hasEmpty){
            console.log("Empty Fields");
            return;
        }
        
        setOpen(true);
        openPopUp();
    }

    // Confirmation Pop up
    const handleConfirm = async () => {
        setLoading(true);
        const data = await addBook(bookData);
        console.log(data.message);
        setLoading(false);

        if(data.status == "failed"){
            setConfirmMessage(data.message);
            setError(true);
            notify();
            return;
        }

        setConfirmMessage(data.message);
        setBookData(initialBookData);
        setAutofilled(false);
        setValidCover(false);
        closePopUp();
        setError(false);
        notify();
        return;
    }

    return(
        <>
            <div className={`${styles.addedPopUp} ${show ? styles.show : ""} ${error ? styles.error : ""}`}>
                {confirmMessage}
            </div>
            {open && <div className={styles.backdrop} />}
            <dialog ref={confirmRef} className={styles.confirmPopUp}>
                <h2>Are you sure you want to add this book?</h2>
                <div className={styles.cover}>
                   <img src={bookData.coverURL}/> 
                   <label>{bookData.callNumber}</label>
                </div>
                <div className={styles.details}>
                    <p><span>TITLE:</span>{bookData.title}</p>
                    <p><span>AUTHOR:</span>{bookData.author}</p>
                    <p><span>ISBN:</span>{bookData.isbn}</p>
                </div>
                <div className={styles.popUpButtons}>
                    <button onClick={() => closePopUp()}>Cancel</button>
                    <button onClick={handleConfirm} disabled={loading ? true : false}> {loading ? "Confirming..." : "Confirm" }</button>
                </div>
                
            </dialog>
            <div className={styles.container}>
                
                <div className={styles.addBookContainer}>
                    <div className={`${styles.coverContainer} ${validCover ? styles.validCover : " "}`}>
                        <p className={validCover ? styles.hidden : ""}>
                            { !autofilled && !validCover ? <>Add Book<br/>Cover</> : "No Available Cover"}
                        </p>
                        <img
                            src={bookData.coverURL}
                            className={!validCover ? styles.hidden : ""}
                        />
                    </div>
                    <div className={styles.infos}>
                        <div className={styles.fields}>
                            <div>
                                <label>
                                    ISBN <span className={invalidISBN ? styles.invalidMessage : styles.hidden}>
                                            Invalid ISBN
                                         </span>
                                </label>
                                <input
                                    type="text"
                                    name="isbn"
                                    className={emptyFields.isbn ? styles.empty : ""}
                                    value={bookData.isbn}
                                    onChange={handleChange}
                                    onBlur={(e) => handleAutoFill(e.target)}
                                />
                            </div>
                            <div>
                                <label>TITLE</label>
                                <input
                                    type="text"
                                    name="title"
                                    className={emptyFields.title ? styles.empty : ""}
                                    value={bookData.title || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>AUTHOR</label>
                                <input
                                    type="text"
                                    name="author"
                                    className={emptyFields.author ? styles.empty : ""}
                                    value={bookData.author || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>EDITION</label>
                                <input
                                    type="text"
                                    name="edition"
                                    className={emptyFields.edition ? styles.empty : ""}
                                    value={bookData.edition || ""}
                                    onChange={handleChange}/>
                            
                            </div>

                            <div>
                                <label>DESCRIPTION</label>
                                <textarea
                                    type="text"
                                    name="description"
                                    className={emptyFields.description ? styles.empty : ""}
                                    value={bookData.description || ""}
                                    onChange={handleChange}/>
                            
                            </div>

                            <div>
                                <label>PUBLISHER</label>
                                <input
                                    type="text"
                                    name="publisher"
                                    className={emptyFields.publisher ? styles.empty : ""}
                                    value={bookData.publisher || ""}
                                    onChange={handleChange}/>
                            
                            </div>

                            <div>
                                <label>YEAR PUBLISHED</label>
                                <input
                                    type="text"
                                    name="yearPublished"
                                    className={emptyFields.yearPublished ? styles.empty : ""}
                                    value={bookData.yearPublished || ""}
                                    onChange={handleChange}/>
                            
                            </div>

                            <div>
                                <label>DATE ACQUIRED</label>
                                <input
                                    type="text"
                                    name="dateAcquired"
                                    className={emptyFields.dateAcquired ? styles.empty : ""}
                                    value={bookData.dateAcquired || ""}
                                    onChange={handleChange}/>
                            
                            </div>

                            <div>
                                <label>PAGES</label>
                                <input
                                    type="text"
                                    name="pages"
                                    className={emptyFields.pages ? styles.empty : ""}
                                    value={bookData.pages || ""}
                                    onChange={handleChange}/>
                            
                            </div>
                            
                            <div>
                                <label>TAGS</label>
                                <input
                                    type="text"
                                    name="tags"
                                    className={emptyFields.tags ? styles.empty : ""}
                                    value={bookData.tags || ""}
                                    onChange={handleChange}/>
                            
                            </div>

                            <div>
                                <label>CLASSIFICATION</label>
                                <select
                                    name="classification"
                                    className={emptyFields.classification ? styles.empty : ""}
                                    value={bookData.classification || ""}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled hidden></option>
                                    <option value="001">001 - General Information</option>
                                    <option value="100">100 - Philosophy & Psychology</option>
                                    <option value="200">200 - Religion</option>
                                    <option value="300">300 - Social Sciences</option>
                                    <option value="400">400 - Language</option>
                                    <option value="500">500 - Science</option>
                                    <option value="600">600 - Technology</option>
                                    <option value="700">700 - Arts & Recreation</option>
                                    <option value="800">800 - Literature</option>
                                    <option value="900">900 - History</option>
                                </select>
                            </div>

                            <div>
                                <label>CALL NUMBER</label>
                                <input
                                    type="text"
                                    name="callNumber"
                                    className={emptyFields.callNumber ? styles.empty : ""}
                                    value={bookData.callNumber || ""}
                                    onChange={handleChange}/>
                            
                            </div>

                        </div>
                        <div className={styles.buttons}>
                            <button onClick={handleClear}>Clear</button>
                            <button onClick={handleCheckFields} disabled={loading}>Add</button>
                        </div>
                        
                    </div>
                </div>
            </div>
            
        </>
    )
}