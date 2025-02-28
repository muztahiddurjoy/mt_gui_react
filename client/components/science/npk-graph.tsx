"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Button } from '../ui/button';
import { PlayCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const NPKGraph = () => {
    // State to hold the NPK data
    const [npkData, setNpkData] = useState({
        labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`), // Initial labels: 1s to 12s
        datasets: [
            {
                label: 'Nitrogen (mg/kg)',
                data: Array(12).fill(150), // Initial data for Nitrogen (midpoint of range)
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Phosphorus (mg/kg)',
                data: Array(12).fill(35), // Initial data for Phosphorus (midpoint of range)
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
                label: 'Potassium (mg/kg)',
                data: Array(12).fill(200), // Initial data for Potassium (midpoint of range)
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    });

    // Function to generate a random value within a range
    const generateRandomValue = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    // Function to update the NPK data
    const updateNpkData = () => {
        setNpkData((prevData) => {
            const newDataNitrogen = [...prevData.datasets[0].data.slice(1), generateRandomValue(100, 200)]; // Update Nitrogen
            const newDataPhosphorus = [...prevData.datasets[1].data.slice(1), generateRandomValue(20, 50)]; // Update Phosphorus
            const newDataPotassium = [...prevData.datasets[2].data.slice(1), generateRandomValue(100, 300)]; // Update Potassium

            return {
                ...prevData,
                datasets: [
                    { ...prevData.datasets[0], data: newDataNitrogen },
                    { ...prevData.datasets[1], data: newDataPhosphorus },
                    { ...prevData.datasets[2], data: newDataPotassium },
                ],
            };
        });
    };

    // UseEffect to update the data every second
    useEffect(() => {
        const interval = setInterval(() => {
            updateNpkData();
        }, 1000); // Update every 1 second

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (seconds)',
                    color: 'cyan',
                },
                ticks: {
                    color: 'cyan',
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Concentration (mg/kg)',
                    color: 'cyan',
                },
                ticks: {
                    color: 'cyan',
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)',
                },
            },
        },
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className='rounded-md bg-primary/30 text-sm text-white px-5 py-2'>NPK Graph </h1>
                <Button>
                    <PlayCircle /> Record Value (12s)
                </Button>
            </div>
            <div style={{ width: '100%', height: 'auto' }} className="mt-5">
                <Line data={npkData} options={options} />
            </div>
        </div>
    );
};

export default NPKGraph;