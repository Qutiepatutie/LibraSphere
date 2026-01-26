import styles from "../../styles/adminPages/borrowers.module.css"

import { useState } from "react";

import { SearchBar } from "../../components/ui/Inputs.jsx"
import { useBorrowers } from "../../hooks/useBorrowers.js";

export default function Borrowers() {

    const { allBorrowers, searchBorrowers } = useBorrowers();

    const [query, setQuery] = useState("");

    const borrowerList = query
        ? searchBorrowers(allBorrowers, query)
        : allBorrowers;

    return (
        <div className={styles.borrowers}>
            <div className={styles.header}>
                <SearchBar 
                    placeholder="Search by name or ID number"
                    name="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table>

                    <colgroup>
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                    </colgroup>

                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>ID Number</th>
                            <th>Email</th>
                            <th>Program</th>
                            <th>Borrow Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {borrowerList.map((b, key) => (
                            <tr key={key}>
                                <td>{key+1}</td>
                                <td>{`${b.user.first_name} ${b.user.last_name}`}</td>
                                <td>{b.user.student_number}</td>
                                <td>{b.user.email}</td>
                                <td>{b.user.program}</td>
                                <td>{b.borrow_date ? b.borrow_date.slice(0,10) : "--"}</td>
                                <td><span className={`${styles.status} ${styles[b.status]}`}>{b.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}