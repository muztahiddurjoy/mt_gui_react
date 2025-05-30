"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import ROSLIB from "roslib";
import { getROS } from "@/ros-functions/connect";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const TemperatureGraph = () => {
  const [tempReadings, setTempReadings] = useState<number[]>(Array(12).fill(0));
  const [lastValidValue, setLastValidValue] = useState(0);

  useEffect(() => {
    let temperatureTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();
        temperatureTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.temperature.name,
          messageType: topics.temperature.messageType,
        });

        temperatureTopic.subscribe((message: any) => {
          const value = parseFloat(message.data);
          if (!isNaN(value) && value !== -1) {
            setLastValidValue(value);
            setTempReadings((prev) => [...prev.slice(1), value]);
          } else {
            // If invalid, use last valid value
            setTempReadings((prev) => [...prev.slice(1), lastValidValue]);
          }
        });
      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (temperatureTopic) temperatureTopic.unsubscribe();
    };
  }, [lastValidValue]);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => i==0?`0s`:`-${i}s`).reverse(),
    datasets: [
      {
        label: "Temperature (°C)",
        data: tempReadings,
        fill: false,
        backgroundColor: "rgb(255, 159, 64)", // Orange color
        borderColor: "rgba(255, 159, 64, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(255, 159, 64)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "cyan" },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
      },
      y: {
        min: 0,
        max: 50,
        ticks: { color: "rgb(255, 159, 64)", stepSize: 5 },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
        title: {
          display: true,
          text: "Temperature (°C)",
          color: "rgb(255, 159, 64)",
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
          label: (context) => `Temperature: ${context.parsed.y}°C`,
        },
      },
    },
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-end mb-2">
        <span className="text-xs text-cyan-300">
          Current: {lastValidValue.toFixed(1)}°C
        </span>
      </div>
      <div className="flex-1 min-h-[200px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TemperatureGraph;
