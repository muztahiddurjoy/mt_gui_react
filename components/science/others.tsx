"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const OthersGraphs = () => {
  // State to hold the sensor data
  const [sensorData, setSensorData] = useState({
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`), // Initial labels: 1s to 12s
    datasets: [
      {
        label: "CO Concentration (ppm)",
        data: Array(12).fill(12.5), // Initial data (midpoint of range)
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Oxygen Concentration (%)",
        data: Array(12).fill(19), // Initial data (midpoint of range)
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "UV Intensity (mW/cm²)",
        data: Array(12).fill(2.5), // Initial data (midpoint of range)
        fill: false,
        backgroundColor: "rgb(153, 102, 255)",
        borderColor: "rgba(153, 102, 255, 0.2)",
      },
      {
        label: "Temperature (°C)",
        data: Array(12).fill(20), // Initial data (midpoint of range)
        fill: false,
        backgroundColor: "rgb(255, 159, 64)",
        borderColor: "rgba(255, 159, 64, 0.2)",
      },
      {
        label: "Altitude (m)",
        data: Array(12).fill(500), // Initial data (midpoint of range)
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Humidity (%)",
        data: Array(12).fill(85), // Initial data (midpoint of range)
        fill: false,
        backgroundColor: "rgb(153, 102, 255)",
        borderColor: "rgba(153, 102, 255, 0.2)",
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
      const newDataCO = [
        ...prevData.datasets[0].data.slice(1),
        generateRandomValue(7, 18),
      ]; // CO Concentration
      const newDataOxygen = [
        ...prevData.datasets[1].data.slice(1),
        generateRandomValue(16, 22),
      ]; // Oxygen Concentration
      const newDataUV = [
        ...prevData.datasets[2].data.slice(1),
        generateRandomValue(0, 5),
      ]; // UV Intensity
      const newDataTemp = [
        ...prevData.datasets[3].data.slice(1),
        generateRandomValue(0, 40),
      ]; // Temperature
      const newDataAltitude = [
        ...prevData.datasets[4].data.slice(1),
        generateRandomValue(150, 151),
      ]; // Altitude
      const newDataHumidity = [
        ...prevData.datasets[5].data.slice(1),
        generateRandomValue(70, 100),
      ]; // Humidity

      return {
        ...prevData,
        datasets: [
          { ...prevData.datasets[0], data: newDataCO },
          { ...prevData.datasets[1], data: newDataOxygen },
          { ...prevData.datasets[2], data: newDataUV },
          { ...prevData.datasets[3], data: newDataTemp },
          { ...prevData.datasets[4], data: newDataAltitude },
          { ...prevData.datasets[5], data: newDataHumidity },
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
          text: "Time (seconds)",
          color: "white",
        },
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(0, 255, 255, 0.2)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
          color: "white",
        },
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(0, 255, 255, 0.2)",
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
      <div style={{ width: "100%", height: "auto" }} className="mt-5">
        <Line data={sensorData} options={options} />
      </div>
    </div>
  );
};

export default OthersGraphs;
