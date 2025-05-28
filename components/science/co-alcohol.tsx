"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { getROS } from "@/ros-functions/connect";
import ROSLIB from "roslib";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const GasGraph = () => {
  const [coReadings, setCoReadings] = useState<number[]>(Array(12).fill(0));
  const [alcoholReadings, setAlcoholReadings] = useState<number[]>(Array(12).fill(0));

  const [lastCo, setLastCo] = useState(0);
  const [lastAlcohol, setLastAlcohol] = useState(0);

  useEffect(() => {
    let coTopic: ROSLIB.Topic | null = null;
    let alcoholTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();

        // Subscribe to CO topic
        coTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.co.name,
          messageType: topics.co.messageType,
        });

        coTopic.subscribe((message: any) => {
          const newValue = parseFloat(message.data);
          if (!isNaN(newValue)) {
            setLastCo(newValue);
            setCoReadings((prev) => [...prev.slice(1), newValue]);
          } else {
            setCoReadings((prev) => [...prev.slice(1), lastCo]);
          }
        });

        // Subscribe to Alcohol topic
        alcoholTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.concentration.name,
          messageType: topics.concentration.messageType,
        });

        alcoholTopic.subscribe((message: any) => {
          const newValue = parseFloat(message.data);
          if (!isNaN(newValue)) {
            setLastAlcohol(newValue);
            setAlcoholReadings((prev) => [...prev.slice(1), newValue]);
          } else {
            setAlcoholReadings((prev) => [...prev.slice(1), lastAlcohol]);
          }
        });
      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (coTopic) coTopic.unsubscribe();
      if (alcoholTopic) alcoholTopic.unsubscribe();
    };
  }, [lastCo, lastAlcohol]);

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`),
    datasets: [
      {
        label: "CO (ppm)",
        data: coReadings,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(75, 192, 192)",
        yAxisID: "y",
      },
      {
        label: "Alcohol (ppm)",
        data: alcoholReadings,
        fill: false,
        backgroundColor: "rgb(153, 102, 255)",
        borderColor: "rgba(153, 102, 255, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(153, 102, 255)",
        yAxisID: "y1",
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
        max: 30,
        ticks: { color: "rgb(75, 192, 192)", stepSize: 1 },
        grid: { color: "rgba(0, 255, 255, 0.2)" },
        title: { display: true, text: "CO (ppm)", color: "rgb(75, 192, 192)" },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        min: 0,
        max: 100,
        ticks: { color: "rgb(153, 102, 255)", stepSize: 10 },
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Alcohol (ppm)", color: "rgb(153, 102, 255)" },
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
            const value = context.parsed.y !== null ? `${context.parsed.y} ppm` : "";
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end mb-2">
        <span className="text-xs text-cyan-400">
          Last Values: CO {lastCo} ppm | Alcohol {lastAlcohol} ppm
        </span>
      </div>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GasGraph;
