"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { getROS } from "@/ros-functions/connect";
import ROSLIB from "roslib";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const LightHumidityGraph = () => {
  const [lightReadings, setLightReadings] = useState<number[]>(Array(12).fill(0));
  const [lastValidValue, setLastValidValue] = useState(0);

  useEffect(() => {
    let lightTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();
        lightTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.light.name,
          messageType: topics.light.messageType,
        });

        lightTopic.subscribe((message: any) => {
          const newValue = parseFloat(message.data);
          if (!isNaN(newValue)) {
            setLastValidValue(newValue);
            setLightReadings((prev) => [...prev.slice(1), newValue]);
          } else {
            // Fallback to last valid value
            setLightReadings((prev) => [...prev.slice(1), lastValidValue]);
          }
        });
      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (lightTopic) lightTopic.unsubscribe();
    };
  }, [lastValidValue]);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => i==0?`0s`:`-${i}s`).reverse(),
    datasets: [
      {
        label: "Light (Lux)",
        data: lightReadings,
        fill: false,
        backgroundColor: "rgb(255, 205, 86)",
        borderColor: "rgba(255, 205, 86, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(255, 205, 86)",
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        ticks: { color: "cyan" },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0,
        max: 150,
        ticks: { color: "rgb(255, 205, 86)", stepSize: 1 },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
        title: {
          display: true,
          text: "Light (Lux)",
          color: "rgb(255, 205, 86)",
        },
      },
    },
    plugins: {
      legend: {
        labels: { color: "cyan", font: { size: 12 } },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y !== null ? `${context.parsed.y} Lux` : "";
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end mb-2">
        <span className="text-xs text-yellow-400">
          Last Value: {lastValidValue} Lux
        </span>
      </div>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LightHumidityGraph;
