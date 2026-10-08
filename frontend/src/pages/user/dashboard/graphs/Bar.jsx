import styles from "../../../../styles/userPages/dashboard/graphcontainer.module.css"

import {Chart as Chartjs, CategoryScale, LinearScale, BarElement, Tooltip, Legend} from "chart.js"
import { Bar } from "react-chartjs-2"

import { barData } from "./test.data"

export default function BarGraph() {

    const data = barData;
    
    Chartjs.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p>Most Borrowed Subjects</p>
                <p className={styles.subHeader}>Based on your history</p>
            </div>
            <div className={styles.graphContainer}>
                <div className={`${styles.graph} ${styles.bar}`}>
                    <Bar
                        data={{
                            labels: data?.map(data => data.label),
                            datasets: [
                                {
                                    data: data?.map(data => data.data),
                                    backgroundColor: [
                                        "#5D6D4F",
                                    ],
                                },
                            ],
                        }}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                tooltip: {
                                    enabled: false,
                                }
                            },
                            indexAxis: 'y',
                            scales: {
                                y: {
                                    ticks: {
                                        crossAlign: "far",
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}