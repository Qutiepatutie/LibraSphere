import { Routes, Route } from "react-router-dom" 

import AuthPage from "../pages/auth/AuthPage"
import MainLayout from "../layouts/MainLayout"
import AdminDashboardLayout from "../layouts/AdminDashboardLayout.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import AdminRoute from "./AdminRoute.jsx"
import AttendanceRoute from "./AttendanceRoute.jsx"

import UserDashboardLayout from "../layouts/UserDashboardLayout.jsx"
import UserStatistics from "../pages/user/dashboard/UserStatistics.jsx"
import BorrowingHistory from "../pages/user/dashboard/BorrowingHistory.jsx"
import Library from "../pages/user/library/Library.jsx"
import BorrowedBooks from "../pages/user/borrowedBooks/BorrowedBooks.jsx"

import AdminStatistics from "../pages/admin/dashboard/AdminStatistics.jsx"
import BookBorrowers from "../pages/admin/dashboard/BookBorrowers.jsx"
import ReturnBooks from "../pages/admin/dashboard/ReturnBooks.jsx"
import Borrowers from "../pages/admin/Borrowers.jsx"
import AddBook from "../pages/admin/addbook/AddBook.jsx"
import Attendance from "../pages/attendance/Attendance.jsx"
import DiscussionRoom from "../pages/user/DiscussionRoom.jsx"

export default function AppRoutes() {

  return (
    <Routes>
        <Route path ="/" element={<AuthPage />} />

        <Route element= { <ProtectedRoute /> } >
          <Route element={<AttendanceRoute />} >
               <Route path="/attendance" element = {<Attendance />} />
          </Route>
          <Route element= {<MainLayout />}>
                <Route path="/dashboard" element={<UserDashboardLayout />}>
                    <Route path="statistics" element={<UserStatistics/>} />
                    <Route path="history" element={<BorrowingHistory/>} />
                </Route>
               <Route path="/library" element = {<Library />} />
               <Route path="/borrowed-books" element = {<BorrowedBooks />} />
               <Route path="/discussion-room-reservation" element = {<DiscussionRoom />} />

               <Route  element = {<AdminRoute />} >
                    <Route path ="/admin/dashboard" element={<AdminDashboardLayout />}>
                        <Route path="statistics" element= {<AdminStatistics />} />
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
