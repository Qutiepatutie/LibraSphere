import styles from "../../styles/adminPages/dashboard/carousel.module.css"
import avatar from "../../assets/profile-icon.svg"

import CustomButton from "../ui/CustomButton.jsx"

export default function Carousel({ borrowers, updateBookStatus, acceptBook, loading }) {
    
    const handleScroll = (e) => {
        e.currentTarget.scrollLeft += e.deltaY * 2;
    }

    return (
        <div className={styles.carousel} onWheel={handleScroll}>
            {borrowers.map((borrower, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.profile}>
                            <img className={styles.avatar} src={avatar}/>
                            <div className={styles.profileInfo}>
                                <p className={styles.name}>
                                    {`${borrower.user.first_name} ${borrower.user.last_name}`}
                                </p>
                                <p className={styles.id}>ID: <span>{borrower.user.student_number}</span></p>
                            </div>
                        </div>
                        <div className={`${styles.status} ${styles[borrower.status]}`}>
                            <p>{borrower.status}</p>
                        </div>
                    </div>
                    <div className={styles.body}>
                        <img className={styles.bookCover} src={borrower.book.cover_path}/>

                        <div className={styles.bookInfo}>
                            <p>Book: {borrower.book.title}</p>
                            <p>Call Number: {borrower.book.call_number}</p>
                            <p>ISBN: {borrower.book.ISBN}</p>
                        </div>
                    </div>
                    <div className={styles.button}>
                        {borrower.status !== "Pending" &&
                            <p>
                                Due Date: {borrower.due_date}
                            </p>
                        }
                        {borrower.status === "Pending" && 
                            <CustomButton 
                                value="Cancel"
                                height="3em"
                                width="30%"
                                bgColor="#ededed"
                                color="black"
                                onClick={() => updateBookStatus(borrower.book.ISBN,borrower.book.call_number)}
                                disabled={loading}
                            />
                        }
                        <CustomButton 
                            value={borrower.status !== "Pending" ? "Return" : "Accept"}
                            height="3em"
                            width="30%"
                            onClick={() => {
                                if(borrower.status !== "Pending") {
                                    updateBookStatus(borrower.book.ISBN, borrower.book.call_number);
                                } else {
                                    acceptBook(borrower.book.ISBN, borrower.book.call_number);
                                }
                                }
                            }
                            disabled={loading}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}