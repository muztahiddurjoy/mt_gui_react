"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { getROS } from "@/ros-functions/connect";
import ROSLIB from "roslib";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const PressureGraph = () => {
  const [pressureReadings, setPressureReadings] = useState<number[]>(Array(12).fill(0));
  const [lastValidValue, setLastValidValue] = useState(0);

  useEffect(() => {
    let pressureTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();
        pressureTopic = new ROSLIB.Topic({
          ros,
          name: topics.pressure.name,
          messageType: topics.pressure.messageType,
        });

        pressureTopic.subscribe((message: any) => {
          const newValue = parseFloat(message.data) / 1000; // Pa to kPa
          if (!isNaN(newValue)) {
            setLastValidValue(newValue);
            setPressureReadings((prev) => [...prev.slice(1), newValue]);
          } else {
            // fallback to last valid value
            setPressureReadings((prev) => [...prev.slice(1), lastValidValue]);
          }
        });
      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (pressureTopic) pressureTopic.unsubscribe();
    };
  }, [lastValidValue]);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => i==0?`0s`:`-${i}s`).reverse(),
    datasets: [
      {
        label: "Pressure (kPa)",
        data: pressureReadings,
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
        ticks: { color: "pink" },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
      },
      y: {
        min: 80,
        max: 150,
        ticks: { color: "rgb(255, 99, 132)", stepSize: 5 },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
        title: { display: true, text: "Pressure (kPa)", color: "rgb(255, 99, 132)" },
      },
    },
    plugins: {
      legend: { labels: { color: "pink", font: { size: 12 } } },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `Pressure: ${context.parsed.y} kPa`,
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end mb-2">
        <span className="text-xs">Last Value: {lastValidValue.toFixed(2)} kPa</span>
      </div>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PressureGraph;
