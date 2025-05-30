"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import ROSLIB from "roslib";
import { getROS } from "@/ros-functions/connect";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const SoilPhGraph = () => {
  const [readings, setReadings] = useState<number[]>(Array(12).fill(0));
  const [lastValidValue, setLastValidValue] = useState(0);

  useEffect(() => {
    let phTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();
        phTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.soil_ph.name,
          messageType: topics.soil_ph.messageType,
        });

        phTopic.subscribe((message: any) => {
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
      if (phTopic) phTopic.unsubscribe();
    };
  }, [lastValidValue]);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => i==0?`0s`:`-${i}s`).reverse(),
    datasets: [{
      label: "Soil pH",
      data: readings,
      fill: false,
      backgroundColor: "rgb(153, 102, 255)",
      borderColor: "rgba(153, 102, 255, 0.8)",
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
        max: 14,
        ticks: { 
          color: "rgb(153, 102, 255)",
          stepSize: 1,
        },
        title: {
          display: true,
          text: "pH",
          color: "rgb(153, 102, 255)",
        },
      },
    },
    plugins: {
      legend: { labels: { color: "white" }},
      tooltip: {
        callbacks: {
          label: (context) => `pH: ${context.parsed.y.toFixed(1)}`
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-right mb-2">
        <span className="text-xs text-purple-300">
          Current: {lastValidValue.toFixed(1)} pH
        </span>
      </div>
      <div className="flex-1 min-h-[200px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SoilPhGraph;