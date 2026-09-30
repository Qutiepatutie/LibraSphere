import { useMemo } from "react";

import { getBookStatus } from "../../../utils/getBookStatus.js"
import { getStorage } from "../../auth/auth.util.js";
import { useBorrowers } from "../../../hooks/useBorrowers.js"

export function useBorrowedBooks() {
    const { allBorrowers } = useBorrowers();
    
    const borrowedBooks = useMemo(() => allBorrowers.filter(borrower =>
                borrower.user.id_number === getStorage().getItem("id_number")
                && borrower.status !== "Returned"
                && borrower.status !== "Cancelled")
            .map(book => ({
                ...book,
                status: getBookStatus(book),
            })), [allBorrowers]);

    return { borrowedBooks }; 
}