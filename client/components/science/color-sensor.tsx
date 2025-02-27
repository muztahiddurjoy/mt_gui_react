"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React from 'react'
import { Line } from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend);  

const ColorSensorGraphs = () => {
    const data = {
        labels: ['1s','2s','3s','4s','5s','6s','7s','8s','9s','10s','11s','12s'],
        datasets: [
            {
                label: 'Color Sensor 1 - Red',
                data: [255, 200, 150, 100, 50, 0, 50, 100, 150, 200, 255, 200],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Color Sensor 1 - Green',
                data: [100, 150, 200, 255, 200, 150, 100, 50, 0, 50, 100, 150],
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Color Sensor 1 - Blue',
                data: [50, 100, 150, 200, 255, 200, 150, 100, 50, 0, 50, 100],
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
                label: 'Color Sensor 2 - Red',
                data: [0, 50, 100, 150, 200, 255, 200, 150, 100, 50, 0, 50],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Color Sensor 2 - Green',
                data: [150, 100, 50, 0, 50, 100, 150, 200, 255, 200, 150, 100],
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Color Sensor 2 - Blue',
                data: [200, 255, 200, 150, 100, 50, 0, 50, 100, 150, 200, 255],
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

    const options = {
        scales: {
            x: {
                ticks: {
                    color: 'cyan' // Change this to your desired color
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)' // Change this to your desired color
                }
            },
            y: {
                ticks: {
                    color: 'cyan' // Change this to your desired color
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)' // Change this to your desired color
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

export default ColorSensorGraphs