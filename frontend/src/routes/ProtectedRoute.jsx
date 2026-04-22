import { Navigate, Outlet } from "react-router-dom" 

export default function ProtectedRoute({ children }) {

    const isAuth = localStorage.getItem("access") || sessionStorage.getItem("access");

    return isAuth ? <Outlet /> : <Navigate to="/" replace />;
}