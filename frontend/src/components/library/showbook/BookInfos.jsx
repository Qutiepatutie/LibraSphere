import styles from "../../../styles/library/showBook/bookinfos.module.css"

export default function BookInfos({ bookDetails, details, handleChange, isEdit }){
    return (
        <div className={styles.infos}>
            <div className={styles.header}>
                <p>{bookDetails.title}</p>
                <p>By <span>{bookDetails.author}</span></p>
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
                        readOnly: !isEdit || key === "isbn",
                        value: bookDetails[key],
                        onChange: handleChange
                    }

                    return (
                        <p key={index} className={styles[key.replaceAll(" ","-").toLowerCase()]}>
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
