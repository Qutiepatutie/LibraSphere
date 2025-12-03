import styles from '../../styles/authPage/registerForm/second.module.css'

export default function Second({ sex, setSex, handleChange, setRegisterData, registerData, emptyProgram, emptyStudNumber }) {
    return (
        <>
            <div className={styles.sexContainer}>
                <label>Sex</label>
                <div className={styles.sexChoice}>
                    <div
                        onClick={() => {
                            setRegisterData({ ...registerData, sex: "male" })
                            setSex("male")}}
                        className={`${styles.male} ${sex == "male" ? styles.maleFocus : ""}`}
                        >
                        Male
                    </div>
                    <div
                        onClick={() => {
                            setRegisterData({ ...registerData, sex: "female" })
                            setSex("female")}}
                        className={`${styles.male} ${sex == "female" ? styles.femaleFocus : ""}`}
                        >
                        Female
                    </div>
                </div>
            </div>

            <label>Program</label>
            <select name="program" value={registerData.program} onChange={handleChange} className={emptyProgram ? styles.empty : ""}>
                <option value="" disabled hidden></option>
                <option value="BSPSYCH">BS in Psychology</option>
                <option value="BSAIS">BS in Accounting Information System</option>
                <option value="BSA">BS in Accountancy</option>
                <option value="BSCS">BS in Computer Science</option>
                <option value="BSITM">BS in International Tourism Management</option>
                <option value="BSCRIM">BS in Criminology</option>
                <option value="BSIHM">BS in International Hospitality Management</option>
                <option value="BSMLS">BS in Medical Laboratory Science </option>
                <option value="BSPT">BS in Physical Therapy</option>
                <option value="BSP">BS in Pharmacy</option>
                <option value="BSN">BS in Nursing</option>
            </select>

            <label>Student Number</label>
            <input
                type="text"
                name="student_number"
                value={registerData.student_number}
                onChange={handleChange}
                className={emptyStudNumber ? styles.empty : ""}
            />
        </>
    )
}