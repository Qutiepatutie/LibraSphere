import styles from "../../../styles/userPages/library/showbook/bookinfos.module.css"

export default function BookInfos({ bookDetails, details, handleChange, isEdit }){
    return (
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
        </div>
    );
}