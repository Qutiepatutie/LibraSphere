import styles from "../styles/mainlayout.module.css"

import { Outlet } from "react-router-dom"

import Sidebar from "../components/layout/Sidebar.jsx"
import Header from "../components/layout/Header.jsx"

export default function MainLayout() {

    return (
        <div className={styles.container}>
            <Sidebar />
            <Header />

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    )
}