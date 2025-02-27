"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React from 'react'
import { Line } from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend);  

const UvGraph = () => {
    const data = {
        labels: ['1s','2s','3s','4s','5s','6s','7s','8s','9s','10s','11s','12s'],
        datasets: [
            {
                label: 'Average UV Index',
                data: [2, 3, 5, 7, 9, 11, 12, 11, 8, 6, 4, 2],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    const options = {
        scales: {
            x: {
                ticks: {
                    color: 'blue' // Change this to your desired color
                },
                grid: {
                    color: 'rgba(0, 0, 255, 0.2)' // Change this to your desired color
                }
            },
            y: {
                ticks: {
                    color: 'blue' // Change this to your desired color
                },
                grid: {
                    color: 'rgba(0, 0, 255, 0.2)' // Change this to your desired color
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

export default UvGraph