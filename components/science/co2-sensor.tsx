"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const CO2Graph = () => {
  // State to hold the CO₂ data
  const [co2Data, setCo2Data] = useState({
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`), // Initial labels: 1s to 12s
    datasets: [
      {
        label: "CO₂ Concentration (%)",
        data: Array(12).fill(0.04), // Initial data (midpoint of range)
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  });

  // Function to generate a random value within a range
  const generateRandomValue = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // Function to update the CO₂ data
  const updateCO2Data = () => {
    setCo2Data((prevData) => {
      const newData = [
        ...prevData.datasets[0].data.slice(1),
        generateRandomValue(0.03, 0.05),
      ]; // Remove the first point and add a new one
      return {
        ...prevData,
        datasets: [{ ...prevData.datasets[0], data: newData }],
      };
    });
  };

  // UseEffect to update the data every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateCO2Data();
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
          text: "CO₂ Concentration (%)",
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
        <Line data={co2Data} options={options} />
      </div>
    </div>
  );
};

export default CO2Graph;
