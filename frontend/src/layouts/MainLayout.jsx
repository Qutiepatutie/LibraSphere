import styles from "../styles/mainlayout.module.css"

import { Outlet } from "react-router-dom"
import { useState } from "react"

import Sidebar from "../components/layout/Sidebar.jsx"
import Header from "../components/layout/Header.jsx"

export default function MainLayout() {

    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className={styles.container}>
            <Sidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />

            <Header
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    )
}
