"use client";
import { ArcElement, Legend, Tooltip } from "chart.js";
import ChartJS from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";
import ROSLIB from "roslib";
import { getROS } from "@/ros-functions/connect";
import { topics } from "@/topics";

ChartJS.register(ArcElement, Tooltip, Legend);

const NPKGraph = () => {
  // State to hold the NPK data
  const [npkData, setNpkData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => i==0?`0s`:`-${i}s`).reverse(),
    datasets: [
      {
        label: "Nitrogen (mg/kg)",
        data: Array(24).fill(0),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.8)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Phosphorus (mg/kg)",
        data: Array(24).fill(0),
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.8)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Potassium (mg/kg)",
        data: Array(24).fill(0),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.8)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  });

  // Track last valid values
  const [lastValidValues, setLastValidValues] = useState({
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
  });

  useEffect(() => {
    let nitrogenTopic: ROSLIB.Topic | null = null;
    let phosphorusTopic: ROSLIB.Topic | null = null;
    let potassiumTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();

        // Nitrogen subscriber
        nitrogenTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.soil_nitrogen.name,
          messageType: topics.soil_nitrogen.messageType,
        });

        nitrogenTopic.subscribe((message: any) => {
          const value = message.data;
          if (value !== -1) {
            setLastValidValues(prev => ({ ...prev, nitrogen: value }));
            updateNpkData('nitrogen', value);
          } else {
            updateNpkData('nitrogen', lastValidValues.nitrogen);
          }
        });

        // Phosphorus subscriber
        phosphorusTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.soil_phosphorus.name,
          messageType: topics.soil_phosphorus.messageType,
        });

        phosphorusTopic.subscribe((message: any) => {
          const value = message.data;
          if (value !== -1) {
            setLastValidValues(prev => ({ ...prev, phosphorus: value }));
            updateNpkData('phosphorus', value);
          } else {
            updateNpkData('phosphorus', lastValidValues.phosphorus);
          }
        });

        // Potassium subscriber
        potassiumTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.soil_potassium.name,
          messageType: topics.soil_potassium.messageType,
        });

        potassiumTopic.subscribe((message: any) => {
          const value = message.data;
          if (value !== -1) {
            setLastValidValues(prev => ({ ...prev, potassium: value }));
            updateNpkData('potassium', value);
          } else {
            updateNpkData('potassium', lastValidValues.potassium);
          }
        });

      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (nitrogenTopic) nitrogenTopic.unsubscribe();
      if (phosphorusTopic) phosphorusTopic.unsubscribe();
      if (potassiumTopic) potassiumTopic.unsubscribe();
    };
  }, []);

  const updateNpkData = (type: 'nitrogen' | 'phosphorus' | 'potassium', newValue: number) => {
    setNpkData((prevData) => {
      const datasetIndex = type === 'nitrogen' ? 0 : type === 'phosphorus' ? 1 : 2;
      const newData = [...prevData.datasets[datasetIndex].data.slice(1), newValue];
      
      const newDatasets = [...prevData.datasets];
      newDatasets[datasetIndex] = {
        ...newDatasets[datasetIndex],
        data: newData
      };

      return {
        ...prevData,
        datasets: newDatasets
      };
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (seconds)",
          color: "cyan",
          font: {
            size: 12,
          },
        },
        ticks: {
          color: "cyan",
        },
        grid: {
          color: "rgba(0, 255, 255, 0.1)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Concentration (mg/kg)",
          color: "cyan",
          font: {
            size: 12,
          },
        },
        min: 0,
        max: 50,
        ticks: {
          color: "cyan",
          stepSize: 0.1,
        },
        grid: {
          color: "rgba(0, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      
      <div className="flex-1 min-h-[300px]">
        <Line 
          data={npkData} 
          options={options}
          height={null}
          width={null}
        />
      </div>
    </div>
  );
};

export default NPKGraph;