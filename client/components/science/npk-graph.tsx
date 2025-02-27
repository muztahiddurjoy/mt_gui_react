"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React from 'react'
import { Line } from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend);  

const NPKGraph = () => {
    const data = {
        labels: ['1s','2s','3s','4s','5s','6s','7s','8s','9s','10s','11s','12s'],
        datasets: [
            {
                label: 'Nitrogen',
                data: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Phosphorus',
                data: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
                label: 'Potassium',
                data: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (seconds)',
                    color: 'cyan'
                },
                ticks: {
                    color: 'cyan'
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Concentration (mg/L)',
                    color: 'cyan'
                },
                ticks: {
                    color: 'cyan'
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)'
                }
            }
        }
    };
    
    return (
        <div style={{ width: '100%', height: 'auto' }}>
            <Line data={data} options={options} />
        </div>
    )
}

export default NPKGraph
