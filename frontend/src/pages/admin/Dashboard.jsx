import styles from "../../styles/userPages/admindashboard.module.css"

import { useState, useEffect } from "react"

import { SearchBar } from "../../components/ui/Inputs.jsx"

import Carousel from "../../components/adminDashboard/Carousel.jsx"
import Toast from "../../components/ui/Toast.jsx"

import { useBorrowers } from "../../hooks/useBorrowers.js"

export default function AdminDashboard() {

    const {
        pendingBorrowers,
        currentBorrowers,
        loading,
        toastMessage,
        updateBookStatus,
        acceptBook,
        searchBorrowers,
    } = useBorrowers();

    const [showToast, setShowToast] = useState(false);
    
    const [pendingQuery, setPendingQuery] = useState("");
    const [currentQuery, setCurrentQuery] = useState("");

    const displayedPending = pendingQuery
        ? searchBorrowers(pendingBorrowers, pendingQuery)
        : pendingBorrowers;

    const displayedCurrent = currentQuery
        ? searchBorrowers(currentBorrowers, currentQuery)
        : currentBorrowers;

    useEffect(() => {
        if(!toastMessage) return;

        setShowToast(true);
        const t = setTimeout(() => setShowToast(false), 2000);
        return () => clearTimeout(t);
    }, [pendingBorrowers, currentBorrowers]);

    return (
        <>
            <Toast message={toastMessage} show={showToast}/>
            <div className={styles.adminDashboard}>
                <div className={styles.panel}>
                    <div className={styles.carouselHeader}>
                        <p>Pending Borrowers</p>
                        <SearchBar 
                            placeholder="Search by name or ID number"
                            style={{width: "40%"}}
                            name="pending"
                            value={pendingQuery}
                            onChange={(e) => setPendingQuery(e.target.value)}
                        />
                    </div>
                    <div className={`
                            ${styles.carouselContainer}
                            ${loading ? styles.loading : ""}
                            `
                        }
                    >
                        <Carousel
                            borrowers={displayedPending}
                            updateBookStatus={updateBookStatus}
                            acceptBook={acceptBook}
                            loading={loading}
                        />
                    </div>

                </div>
                <div className={styles.panel}>
                    <div className={styles.carouselHeader}>
                        <p>Current Borrowers</p>
                        <SearchBar 
                            placeholder="Search by name or ID number"
                            style={{width: "40%"}}
                            name="current"
                            value={currentQuery}
                            onChange={(e) => setCurrentQuery(e.target.value)}
                        />
                    </div>
                    <div className={`
                            ${styles.carouselContainer}
                            ${loading ? styles.loading : ""}
                            `
                        }
                    >
                        <Carousel
                            borrowers={displayedCurrent}
                            updateBookStatus={updateBookStatus}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}