"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const SoilSensorGraph = () => {
  // State to hold the sensor data
  const [sensorData, setSensorData] = useState({
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`),
    datasets: [
      {
        label: "Soil Temperature (°C)",
        data: Array(12).fill(22),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.8)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y',
      },
      {
        label: "Electrical Conductivity (dS/m)",
        data: Array(12).fill(1.2),
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.8)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1',
      },
    ],
  });

  const generateRandomValue = (min, max, precision = 1) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(precision));
  };

  const updateSensorData = () => {
    setSensorData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: [
            ...prevData.datasets[0].data.slice(1),
            generateRandomValue(15, 30, 1), // Temperature range 15-30°C
          ],
        },
        {
          ...prevData.datasets[1],
          data: [
            ...prevData.datasets[1].data.slice(1),
            generateRandomValue(0.5, 3.0, 2), // EC range 0.5-3.0 dS/m
          ],
        },
      ],
    }));
  };

  useEffect(() => {
    const interval = setInterval(updateSensorData, 1000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.dataset.label.includes('Temperature') 
                ? `${context.parsed.y} °C` 
                : `${context.parsed.y} dS/m`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (seconds)",
          color: "cyan",
          font: {
            size: 12,
          },
        },
        ticks: {
          color: "cyan",
        },
        grid: {
          color: "rgba(0, 255, 255, 0.1)",
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: "Temperature (°C)",
          color: "rgb(255, 99, 132)",
          font: {
            size: 12,
          },
        },
        min: 10,
        max: 35,
        ticks: {
          color: "rgb(255, 99, 132)",
          stepSize: 5,
        },
        grid: {
          color: "rgba(255, 99, 132, 0.1)",
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: "Conductivity (dS/m)",
          color: "rgb(54, 162, 235)",
          font: {
            size: 12,
          },
        },
        min: 0,
        max: 4,
        ticks: {
          color: "rgb(54, 162, 235)",
          stepSize: 0.5,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="rounded-md bg-primary/30 text-sm text-white px-4 py-2">
          Soil Sensors
        </h1>
        <Button className="flex items-center gap-2">
          <PlayCircle size={16} /> Record Value (12s)
        </Button>
      </div>
      <div className="flex-1 min-h-[300px]">
        <Line 
          data={sensorData} 
          options={options}
          height={null}
          width={null}
        />
      </div>
    </div>
  );
};

export default SoilSensorGraph;