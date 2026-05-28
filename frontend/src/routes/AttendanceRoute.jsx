import { Navigate, Outlet } from "react-router-dom";

import { routes } from "../pages/auth/auth.constants";

export default function AdminRoute() {
    const role = localStorage.getItem("role");
   
    if(role !== "attendance") {
         return <Navigate to={routes[role]} replace />
    }
    
    return <Outlet />;
}