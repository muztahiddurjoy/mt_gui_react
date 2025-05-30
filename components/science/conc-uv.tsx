"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { getROS } from "@/ros-functions/connect";
import ROSLIB from "roslib";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const UVGraph = () => {
  const [uvReadings, setUvReadings] = useState<number[]>(Array(12).fill(0));
  const [lastValidValue, setLastValidValue] = useState(0);

  useEffect(() => {
    let uvTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();
        uvTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.uv.name,
          messageType: topics.uv.messageType,
        });

        uvTopic.subscribe((message: any) => {
          const newValue = parseFloat(message.data);
          if (!isNaN(newValue)) {
            setLastValidValue(newValue);
            setUvReadings((prev) => [...prev.slice(1), newValue]);
          } else {
            // Fallback to last valid value
            setUvReadings((prev) => [...prev.slice(1), lastValidValue]);
          }
        });
      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (uvTopic) uvTopic.unsubscribe();
    };
  }, [lastValidValue]);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => i==0?`0s`:`-${i}s`).reverse(),
    datasets: [
      {
        label: "UV Power (mW/cm²)",
        data: uvReadings,
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(255, 99, 132)",
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
        max: 30,
        ticks: { color: "rgb(255, 99, 132)", stepSize: 1 },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
        title: {
          display: true,
          text: "UV Power (mW/cm²)",
          color: "rgb(255, 99, 132)",
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
          label: (context: any) => `UV: ${context.parsed.y} mW/cm²`,
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end mb-2">
        <span className="text-xs text-pink-400">
          Last Value: {lastValidValue} mW/cm²
        </span>
      </div>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default UVGraph;
