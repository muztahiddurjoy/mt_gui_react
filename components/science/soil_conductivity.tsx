"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import ROSLIB from "roslib";
import { getROS } from "@/ros-functions/connect";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const SoilConductivityGraph = () => {
  const [readings, setReadings] = useState<number[]>(Array(12).fill(0));
  const [lastValidValue, setLastValidValue] = useState(0);

  useEffect(() => {
    let conductivityTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();
        conductivityTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.soil_ec.name,
          messageType: topics.soil_ec.messageType,
        });

        conductivityTopic.subscribe((message: any) => {
          const value = message.data;
          if (value !== -1) {
            setLastValidValue(value);
            setReadings(prev => [...prev.slice(1), value]);
          } else {
            setReadings(prev => [...prev.slice(1), lastValidValue]);
          }
        });
      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (conductivityTopic) conductivityTopic.unsubscribe();
    };
  }, [lastValidValue]);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`),
    datasets: [{
      label: "Electrical Conductivity (dS/m)",
      data: readings,
      fill: false,
      backgroundColor: "rgb(75, 192, 192)",
      borderColor: "rgba(75, 192, 192, 0.8)",
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 3,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "cyan" },
        grid: { color: "rgba(0, 255, 255, 0.1)" },
      },
      y: {
        min: 0,
        max: 4,
        ticks: { 
          color: "rgb(75, 192, 192)",
          stepSize: 0.5,
        },
        title: {
          display: true,
          text: "Conductivity (dS/m)",
          color: "rgb(75, 192, 192)",
        },
      },
    },
    plugins: {
      legend: { labels: { color: "white" }},
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(2)} dS/m`
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-right mb-2">
        <span className="text-xs text-teal-300">
          Current: {lastValidValue.toFixed(2)} dS/m
        </span>
      </div>
      <div className="flex-1 min-h-[200px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SoilConductivityGraph;