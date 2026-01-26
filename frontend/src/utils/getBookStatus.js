export function getBookStatus(b) {
    if(!b.due_date) return b.status;

    const today = new Date();
    today.setHours(0,0,0,0);

    const due = new Date(b.due_date);
    due.setHours(0,0,0,0);

    if(due < today) return "Overdue";
    else if(due.getTime() === today.getTime()) return "Due";

    return b.status;
}