import styles from "../styles/layouts/mainlayout.module.css"

import { Outlet } from "react-router-dom"

import Sidebar from "../components/layout/Sidebar.jsx"
import BottomNav from "../components/layout/BottomNav.jsx"
import Header from "../components/layout/Header.jsx"

export default function MainLayout() {

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <Header />
            </div>

            <div className={styles.content}>
                <Outlet />
            </div>
            
            <div className={styles.navContainer}>
                <Sidebar />
                <BottomNav />
            </div>
        </div>
    )
}
