import styles from "../styles/layouts/mainlayout.module.css"

import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/layout/Sidebar.jsx"
import BottomNav from "../components/layout/BottomNav.jsx"
import Header from "../components/layout/header/Header.jsx"
import UserMenu from "../components/layout/header/UserMenu.jsx"

export default function MainLayout() {

    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <Header
                    setShowUserMenu={setShowUserMenu}
                    showUserMenu={showUserMenu}
                />
            </div>

            <div className={styles.contentContainer}>
                <Outlet />
            </div>
            
            <div className={styles.navContainer}>
                <Sidebar />
                <BottomNav />
            </div>

            {showUserMenu && (
                <UserMenu
                    setShowUserMenu={setShowUserMenu}
                />
            )}
        </div>
    )
}
