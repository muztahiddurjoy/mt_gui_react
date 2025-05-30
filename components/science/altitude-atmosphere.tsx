"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { getROS } from "@/ros-functions/connect";
import ROSLIB from "roslib";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const AltimeterGraph = () => {
  const [altitudeReadings, setAltitudeReadings] = useState<number[]>(Array(12).fill(0));
  const [lastValidValue, setLastValidValue] = useState(0);

  useEffect(() => {
    let altitudeTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();
        altitudeTopic = new ROSLIB.Topic({
          ros,
          name: topics.altitude.name,
          messageType: topics.altitude.messageType,
        });

        altitudeTopic.subscribe((message: any) => {
          const newValue = parseFloat(message.data);
          if (!isNaN(newValue)) {
            setLastValidValue(newValue);
            setAltitudeReadings((prev) => [...prev.slice(1), newValue]);
          } else {
            // fallback to last valid value
            setAltitudeReadings((prev) => [...prev.slice(1), lastValidValue]);
          }
        });
      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (altitudeTopic) altitudeTopic.unsubscribe();
    };
  }, [lastValidValue]);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => i==0?`0s`:`-${i}s`).reverse(),
    datasets: [
      {
        label: "Altitude (m)",
        data: altitudeReadings,
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
        ticks: { color: "pink" },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
      },
      y: {
        min: -100,
        max: 1000,
        ticks: { color: "rgb(75, 192, 192)", stepSize: 100 },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
        title: { display: true, text: "Altitude (m)", color: "rgb(75, 192, 192)" },
      },
    },
    plugins: {
      legend: { labels: { color: "pink", font: { size: 12 } } },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `Altitude: ${context.parsed.y} m`,
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end mb-2">
        <span className="text-xs">Last Value: {lastValidValue.toFixed(2)} m</span>
      </div>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AltimeterGraph;
