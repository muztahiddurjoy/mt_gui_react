"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React from 'react'
import { Line } from 'react-chartjs-2'
import { Button } from '../ui/button';
import { PlayCircle } from 'lucide-react';
ChartJS.register(ArcElement, Tooltip, Legend);  

const UvGraph = () => {
    const data = {
        labels: ['1s','2s','3s','4s','5s','6s','7s','8s','9s','10s','11s','12s'],
        datasets: [
            {
                label: 'UV Sensor 1',
                data: [2, 3, 5, 7, 9, 11, 12, 11, 8, 6, 4, 2],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'UV Sensor 2',
                data: [1, 2, 4, 6, 8, 10, 11, 10, 7, 5, 3, 1],
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
        <div>
         <div className="flex items-center justify-end">
                    <Button><PlayCircle/> Record Value (12s) </Button>
                </div>
        <div style={{ width: '100%', height: 'auto' }} className='mt-5'>
            <Line data={data} options={options} />
        </div>
        </div>
    )
}

export default UvGraph