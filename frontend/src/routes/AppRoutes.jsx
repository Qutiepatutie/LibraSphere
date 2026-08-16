import { Routes, Route } from "react-router-dom" 

import AuthPage from "../pages/auth/AuthPage"
import MainLayout from "../layouts/MainLayout"
import AdminDashboardLayout from "../layouts/AdminDashboardLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx"
import AdminRoute from "./AdminRoute.jsx"
import AttendanceRoute from "./AttendanceRoute.jsx"

import Dashboard from "../pages/user/Dashboard.jsx"
import Library from "../pages/user/library/Library.jsx"
import BorrowedBooks from "../pages/user/BorrowedBooks.jsx"

import Statistics from "../pages/admin/dashboard/Statistics.jsx";
import BookBorrowers from "../pages/admin/dashboard/BookBorrowers.jsx";
import ReturnBooks from "../pages/admin/dashboard/ReturnBooks.jsx";
import Borrowers from "../pages/admin/Borrowers.jsx"
import AddBook from "../pages/admin/addbook/AddBook.jsx"
import Attendance from "../pages/attendance/Attendance.jsx"

export default function AppRoutes() {

  return (
    <Routes>
        <Route path ="/" element={<AuthPage />} />

        <Route element= { <ProtectedRoute /> } >
          <Route element={<AttendanceRoute />} >
               <Route path="/attendance" element = {<Attendance />} />
          </Route>
          <Route element= {<MainLayout />}>
               <Route path="/dashboard" element = {<Dashboard />} />
               <Route path="/library" element = {<Library />} />
               <Route path="/borrowed-books" element = {<BorrowedBooks />} />

               <Route  element = {<AdminRoute />} >
                    <Route path ="/admin/dashboard" element={<AdminDashboardLayout />}>
                        <Route path="statistics" element= {<Statistics />} />
                        <Route path="book-borrowers" element= {<BookBorrowers />} />
                        <Route path="return-books" element= {<ReturnBooks />} />
                    </Route>
                    <Route path="/admin/borrowers" element = {<Borrowers />} />
                    <Route path="/admin/add-book" element = {<AddBook />} />
               </Route>
          </Route>    
        </Route>
    </Routes>
  )
}
