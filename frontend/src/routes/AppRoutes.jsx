import { Routes, Route } from "react-router-dom" 

import AuthPage from "../pages/auth/AuthPage"
import MainLayout from "../layouts/MainLayout"
import ProtectedRoute from "./ProtectedRoute.jsx"
import AdminRoute from "./AdminRoute.jsx"

import Dashboard from "../pages/user/Dashboard.jsx"
import Library from "../pages/user/library/Library.jsx"
import BorrowedBooks from "../pages/user/BorrowedBooks.jsx"

import AdminDashboard from "../pages/admin/Dashboard.jsx"
import Borrowers from "../pages/admin/Borrowers.jsx"
import AddBook from "../pages/admin/addbook/AddBook.jsx"

export default function AppRoutes() {

  return (
    <Routes>
        <Route path ="/" element={<AuthPage />} />

        <Route element= { <ProtectedRoute /> } >
            <Route element= {<MainLayout />}>
                <Route path="/dashboard" element = {<Dashboard />} />
                <Route path="/library" element = {<Library />} />
                <Route path="/borrowed-books" element = {<BorrowedBooks />} />

                <Route element = {<AdminRoute />} >
                    <Route path="/admin/dashboard" element = {<AdminDashboard />} />
                    <Route path="/admin/borrowers" element = {<Borrowers />} />
                    <Route path="/admin/add-book" element = {<AddBook />} />
                </Route>
            </Route>    
        </Route>
    </Routes>
  )
}
