"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Button } from '../ui/button';
import { PlayCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const UvGraph = () => {
    // State to hold the UV data for both sensors
    const [uvData, setUvData] = useState({
        labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`), // Initial labels: 1s to 12s
        datasets: [
            {
                label: 'UV Sensor 1 (mW/cm²)',
                data: Array(12).fill(0), // Initial data for Sensor 1
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'UV Sensor 2 (mW/cm²)',
                data: Array(12).fill(0), // Initial data for Sensor 2
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    });

    // Function to generate a new UV data point
    const generateUVPoint = () => {
        const baseValue = 2.5; // Base value around which the data fluctuates
        const fluctuation = 1.5; // Maximum fluctuation from the base value
        const noise = 0.2; // Random noise to add realism
        const sineValue = Math.sin((Date.now() / 1000) * Math.PI * 2); // Sine wave for smooth fluctuation
        const randomNoise = (Math.random() - 0.5) * noise; // Random noise
        return Math.max(0, Math.min(5, baseValue + sineValue * fluctuation + randomNoise)); // Clamp between 0 and 5
    };

    // Function to update the UV data
    const updateUVData = () => {
        setUvData((prevData) => {
            const newDataSensor1 = [...prevData.datasets[0].data.slice(1), generateUVPoint()]; // Remove the first point and add a new one
            const newDataSensor2 = [...prevData.datasets[1].data.slice(1), generateUVPoint()]; // Same for Sensor 2

            return {
                ...prevData,
                datasets: [
                    { ...prevData.datasets[0], data: newDataSensor1 },
                    { ...prevData.datasets[1], data: newDataSensor2 },
                ],
            };
        });
    };

    // UseEffect to update the data every second
    useEffect(() => {
        const interval = setInterval(() => {
            updateUVData();
        }, 1000); // Update every 1 second

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const options = {
        scales: {
            x: {
                ticks: {
                    color: 'cyan', // Change this to your desired color
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)', // Change this to your desired color
                },
            },
            y: {
                ticks: {
                    color: 'cyan', // Change this to your desired color
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)', // Change this to your desired color
                },
            },
        },
    };

    return (
        <div>
            <div className="flex items-center justify-end">
                <Button>
                    <PlayCircle /> Record Value (12s)
                </Button>
            </div>
            <div style={{ width: '100%', height: 'auto' }} className="mt-5">
                <Line data={uvData} options={options} />
            </div>
        </div>
    );
};

export default UvGraph;