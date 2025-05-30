"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { getROS } from "@/ros-functions/connect";
import ROSLIB from "roslib";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const OxygenGraph = () => {
  const [readings, setReadings] = useState<number[]>(Array(12).fill(0));
  const [lastValidValue, setLastValidValue] = useState(0);

  useEffect(() => {
    let oxygenTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();
        oxygenTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.oxygen.name,
          messageType: topics.oxygen.messageType,
        });

        oxygenTopic.subscribe((message: any) => {
          const value = parseFloat(message.data);
          if (!isNaN(value)) {
            setLastValidValue(value);
            setReadings((prev) => [...prev.slice(1), value]);
          } else {
            // Use last valid value if message is invalid
            console.warn("Invalid oxygen value received, using last valid value:", lastValidValue);
            setReadings((prev) => [...prev.slice(1), lastValidValue]);
          }
        });
      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (oxygenTopic) oxygenTopic.unsubscribe();
    };
  }, [lastValidValue]);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => i==0?`0s`:`-${i}s`).reverse(),
    datasets: [
      {
        label: "Oxygen (%)",
        data: readings,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(75, 192, 192)",
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
        max: 100,
        ticks: { color: "cyan", stepSize: 5 },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
        title: {
          display: true,
          text: "Oxygen (%)",
          color: "rgb(75, 192, 192)",
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
          label: (context: any) => `Oxygen: ${context.parsed.y}%`,
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end mb-2">
        <span className="text-xs text-cyan-300">
          Last Value: {lastValidValue}%
        </span>
      </div>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default OxygenGraph;
