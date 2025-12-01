import { useEffect, useState } from 'react'

import styles from './styles/app.module.css'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import LibraryCopy from './pages/Library.jsx'
import BorrowedBooks from './pages/BorrowedBooks.jsx'
import BorrowerLogs from './pages/BorrowerLogs.jsx'
import AddBooks from './pages/AddBooks.jsx'

import ViewBook from "./components/ViewBook.jsx"
import Settings from './components/Settings.jsx'

import Auth from './pages/Auth.jsx'

export default function App(){

    const [currentPage, setCurrentPage] = useState("Dashboard");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [viewBook, setViewBook] = useState(false);

    const [book, setBook] = useState(null);

    useEffect(() => {
        const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
        if(loggedIn){
            setIsAuthorized(true);
        }
    }, []);

    return (
        <>  
            <Auth onLogIn={setIsAuthorized} isAuthorized={isAuthorized}/>
            {isAuthorized &&
                <div className={`${styles.main} ${sessionStorage.getItem("role") === "admin" ? "admin" : ""}`}>
                    <Sidebar onNavigate={setCurrentPage} isOpen={setIsOpen}/>
                    <Header currentPage={currentPage}/>
                    <Settings isOpen={isOpen} setIsOpen={setIsOpen} onLogOut={setIsAuthorized} setCurrentPage={setCurrentPage}/>
                    <ViewBook
                        viewBook={viewBook}
                        setViewBook={setViewBook}   
                        book={book}
                        setBook={setBook}
                    />

                    {currentPage === "Dashboard" && (sessionStorage.getItem("role") === "admin" ? <AdminDashboard /> : <Dashboard />)}
                    {currentPage === "Dashboard"}
                    {currentPage === "Library" &&  <LibraryCopy setViewBook={setViewBook} setBook={setBook} book={book}/>}

                    {currentPage === "Borrowed Books" && <BorrowedBooks />}
                    {currentPage === "Borrower Logs" && <BorrowerLogs />}
                    {currentPage === "Add Books" && <AddBooks />}
                </div>
            }
            
        </>
    )
}