"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface LightHumidityGraphProps {
  lightData: string; // Light reading in lux (e.g., "500")
  humidityData: string; // Humidity reading in percentage (e.g., "45")
}

const LightHumidityGraph = ({
  lightData,
  humidityData,
}: LightHumidityGraphProps) => {
  // State to store the last 12 readings for both metrics
  const [lightReadings, setLightReadings] = useState<number[]>(
    Array(12).fill(0),
  );
  const [mq2Readings, setmq2Readings] = useState<number[]>(Array(12).fill(0));

  // Update readings when new data comes in
  useEffect(() => {
    if (lightData) {
      const newValue = parseFloat(lightData);
      if (!isNaN(newValue)) {
        setLightReadings((prev) => [...prev.slice(1), newValue]);
      }
    }
  }, [lightData]);

  useEffect(() => {
    if (humidityData) {
      const newValue = parseFloat(humidityData);
      if (!isNaN(newValue)) {
        setmq2Readings((prev) => [...prev.slice(1), newValue / 100]);
      }
    }
  }, [humidityData]);

  // Chart data configuration
  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`),
    datasets: [
      {
        label: "Light (Lux)",
        data: lightReadings,
        fill: false,
        backgroundColor: "rgb(255, 205, 86)", // Yellow
        borderColor: "rgba(255, 205, 86, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(255, 205, 86)",
        yAxisID: "y",
      },
      {
        label: "Alcohol (ppm)",
        data: mq2Readings.map((v) => v * 100), // Convert to ppm
        fill: false,
        backgroundColor: "rgb(54, 162, 235)", // Blue
        borderColor: "rgba(54, 162, 235, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(54, 162, 235)",
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          color: "cyan",
        },
        grid: {
          color: "rgba(0, 255, 255, 0.2)",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0,
        max: 150, // Adjust based on expected lux range
        ticks: {
          color: "rgb(255, 205, 86)",
          stepSize: 1,
        },
        grid: {
          color: "rgba(0, 255, 255, 0.2)",
        },
        title: {
          display: true,
          text: "Light (Lux)",
          color: "rgb(255, 205, 86)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        min: 0,
        max: 100, // Percentage scale
        ticks: {
          color: "rgb(54, 162, 235)",
          stepSize: 10,
        },
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Alcohol (ppm)",
          color: "rgb(54, 162, 235)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "cyan",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label +=
                context.dataset.label === "Alchohol (ppm)"
                  ? `${context.parsed.y}ppm`
                  : `${context.parsed.y}Lux`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end mb-2">
        <span className="text-xs">
          Last Values: Light {lightReadings[lightReadings.length - 1]} Lux | MQ2{" "}
          {Number(mq2Readings[mq2Readings.length - 1].toFixed(2))*1000}mV
        </span>
      </div>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LightHumidityGraph;
