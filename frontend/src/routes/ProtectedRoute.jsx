import { Navigate, Outlet } from "react-router-dom" 
import { getAccessToken } from "../pages/auth/auth.util";

export default function ProtectedRoute({ children }) {

    const isAuth = !!getAccessToken();

    return isAuth ? <Outlet /> : <Navigate to="/" replace />;
}