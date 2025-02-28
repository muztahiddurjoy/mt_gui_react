"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Button } from '../ui/button';
import { PlayCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const OthersFour = () => {
    // State to hold the sensor data
    const [sensorData, setSensorData] = useState({
        labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`), // Initial labels: 1s to 12s
        datasets: [
            {
                label: 'Light Intensity (lux)',
                data: Array(12).fill(50050), // Initial data (midpoint of range)
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Air Pressure (Pa)',
                data: Array(12).fill(101325), // Initial data (midpoint of range)
                fill: false,
                backgroundColor: 'rgb(255, 206, 86)',
                borderColor: 'rgba(255, 206, 86, 0.2)',
            },
        ],
    });

    // Function to generate a random value within a range
    const generateRandomValue = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    // Function to update the sensor data
    const updateSensorData = () => {
        setSensorData((prevData) => {
            const newDataLight = [...prevData.datasets[0].data.slice(1), generateRandomValue(100, 100000)]; // Light Intensity
            const newDataPressure = [...prevData.datasets[1].data.slice(1), generateRandomValue(101325 * 0.9, 101325 * 1.1)]; // Air Pressure

            return {
                ...prevData,
                datasets: [
                    { ...prevData.datasets[0], data: newDataLight },
                    { ...prevData.datasets[1], data: newDataPressure },
                ],
            };
        });
    };

    // UseEffect to update the data every second
    useEffect(() => {
        const interval = setInterval(() => {
            updateSensorData();
        }, 1000); // Update every 1 second

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (seconds)',
                    color: 'white',
                },
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                    color: 'white',
                },
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: 'rgba(0, 255, 255, 0.2)',
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
                <Line data={sensorData} options={options} />
            </div>
        </div>
    );
};

export default OthersFour;
