"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface UvGraphProps {
  data: string; // Single UV reading as string (e.g., "2.5")
}

const UvGraph = ({ data }: UvGraphProps) => {
  // State to store the last 12 readings
  const [readings, setReadings] = useState<number[]>(Array(12).fill(0));

  // Update readings when new data comes in
  useEffect(() => {
    if (data) {
      const newValue = parseFloat(data);
      if (!isNaN(newValue)) {
        setReadings((prev) => {
          // Keep only the last 11 readings and add the new one
          const updated = [...prev.slice(1), newValue];
          return updated;
        });
      }
    }
  }, [data]);

  // Chart data configuration
  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`),
    datasets: [
      {
        label: "UV Power (mW/cm²)",
        data: readings,
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.8)",
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(54, 162, 235)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        min: 0,
        max: 30,
        ticks: {
          color: "cyan",
          stepSize: 1,
        },
        grid: {
          color: "rgba(0, 255, 255, 0.2)",
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
      },
    },
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end mb-2">
        {/* <Button size="sm" className="gap-2">
          
        </Button> */}
        <span className="text-xs">
          Last Value: {readings[readings.length - 1]}
        </span>
      </div>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default UvGraph;
