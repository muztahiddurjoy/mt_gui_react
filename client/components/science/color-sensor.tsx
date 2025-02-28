"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Button } from '../ui/button';
import { PlayCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const ColorSensorGraphs = () => {
  // State to hold the color sensor data
  const [colorData, setColorData] = useState({
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`), // Initial labels: 1s to 12s
    datasets: [
      {
        label: 'Color Sensor 1 - Red',
        data: Array(12).fill(0), // Initial data for Red
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Color Sensor 1 - Green',
        data: Array(12).fill(0), // Initial data for Green
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Color Sensor 1 - Blue',
        data: Array(12).fill(0), // Initial data for Blue
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  });

  // Function to generate a random value between 0 and 255 (RGB range)
  const generateRandomValue = () => {
    return Math.floor(Math.random() * 256);
  };

  // Function to update the color sensor data
  const updateColorData = () => {
    setColorData((prevData) => {
      const newDataRed = [...prevData.datasets[0].data.slice(1), generateRandomValue()]; // Update Red
      const newDataGreen = [...prevData.datasets[1].data.slice(1), generateRandomValue()]; // Update Green
      const newDataBlue = [...prevData.datasets[2].data.slice(1), generateRandomValue()]; // Update Blue

      return {
        ...prevData,
        datasets: [
          { ...prevData.datasets[0], data: newDataRed },
          { ...prevData.datasets[1], data: newDataGreen },
          { ...prevData.datasets[2], data: newDataBlue },
        ],
      };
    });
  };

  // UseEffect to update the data every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateColorData();
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
          text: 'RGB Value (0-255)',
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
      <div className="flex items-center justify-end">
        <Button>
          <PlayCircle /> Record Value (12s)
        </Button>
      </div>
      <div style={{ width: '100%', height: 'auto' }} className="mt-5">
        <Line data={colorData} options={options} />
      </div>
    </div>
  );
};

export default ColorSensorGraphs;