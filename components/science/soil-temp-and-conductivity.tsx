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

const SoilSensorGraph = () => {
  // State to hold the sensor data
  const [sensorData, setSensorData] = useState({
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`),
    datasets: [
      {
        label: "Soil Temperature (°C)",
        data: Array(12).fill(0),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.8)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y',
      },
      {
        label: "Soil Moisture (%)",
        data: Array(12).fill(0),
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.8)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1',
      },
      {
        label: "Electrical Conductivity (dS/m)",
        data: Array(12).fill(0),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.8)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y2',
      },
      {
        label: "Soil pH",
        data: Array(12).fill(0),
        fill: false,
        backgroundColor: "rgb(153, 102, 255)",
        borderColor: "rgba(153, 102, 255, 0.8)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y3',
      },
    ],
  });

  // Track last valid values
  const [lastValidValues, setLastValidValues] = useState({
    temperature: 0,
    moisture: 0,
    conductivity: 0,
    ph: 0,
  });

  useEffect(() => {
    let temperatureTopic: ROSLIB.Topic | null = null;
    let moistureTopic: ROSLIB.Topic | null = null;
    let conductivityTopic: ROSLIB.Topic | null = null;
    let phTopic: ROSLIB.Topic | null = null;

    const connectToROS = async () => {
      try {
        const ros = await getROS();

        // Soil Temperature subscriber
        temperatureTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.soil_temperature.name,
          messageType: topics.soil_temperature.messageType,
        });

        temperatureTopic.subscribe((message: any) => {
          const value = message.data;
          if (value !== -1) {
            setLastValidValues(prev => ({ ...prev, temperature: value }));
            updateSensorData('temperature', value);
          } else {
            updateSensorData('temperature', lastValidValues.temperature);
          }
        });

        // Soil Moisture subscriber
        moistureTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.soil_moisture.name,
          messageType: topics.soil_moisture.messageType,
        });

        moistureTopic.subscribe((message: any) => {
          const value = message.data;
          if (value !== -1) {
            setLastValidValues(prev => ({ ...prev, moisture: value }));
            updateSensorData('moisture', value);
          } else {
            updateSensorData('moisture', lastValidValues.moisture);
          }
        });

        // Soil Conductivity subscriber
        conductivityTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.soil_conductivity.name,
          messageType: topics.soil_conductivity.messageType,
        });

        conductivityTopic.subscribe((message: any) => {
          const value = message.data;
          if (value !== -1) {
            setLastValidValues(prev => ({ ...prev, conductivity: value }));
            updateSensorData('conductivity', value);
          } else {
            updateSensorData('conductivity', lastValidValues.conductivity);
          }
        });

        // Soil pH subscriber
        phTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics.soil_ph.name,
          messageType: topics.soil_ph.messageType,
        });
        console.log("phTopic", phTopic);

        phTopic.subscribe((message: any) => {
          const value = message.data;
          console.log("ph", value);
          if (value !== -1) {
            setLastValidValues(prev => ({ ...prev, ph: value }));
            updateSensorData('ph', value);
          } else {
            updateSensorData('ph', lastValidValues.ph);
          }
        });

      } catch (error) {
        console.error("Error connecting to ROS:", error);
      }
    };

    connectToROS();

    return () => {
      if (temperatureTopic) temperatureTopic.unsubscribe();
      if (moistureTopic) moistureTopic.unsubscribe();
      if (conductivityTopic) conductivityTopic.unsubscribe();
      if (phTopic) phTopic.unsubscribe();
    };
  }, []);

  const updateSensorData = (
    type: 'temperature' | 'moisture' | 'conductivity' | 'ph', 
    newValue: number
  ) => {
    setSensorData((prevData) => {
      const datasetIndex = 
        type === 'temperature' ? 0 :
        type === 'moisture' ? 1 :
        type === 'conductivity' ? 2 : 3;
      
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
    interaction: {
      mode: 'index',
      intersect: false,
    },
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
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label.includes('Temperature')) {
                label += `${context.parsed.y.toFixed(1)} °C`;
              } else if (context.dataset.label.includes('Moisture')) {
                label += `${context.parsed.y.toFixed(1)} %`;
              } else if (context.dataset.label.includes('Conductivity')) {
                label += `${context.parsed.y.toFixed(2)} dS/m`;
              } else {
                label += `${context.parsed.y.toFixed(1)} pH`;
              }
            }
            return label;
          }
        }
      }
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
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: "Temperature (°C)",
          color: "rgb(255, 99, 132)",
          font: {
            size: 12,
          },
        },
        min: 0,
        max: 40,
        ticks: {
          color: "rgb(255, 99, 132)",
          stepSize: 5,
        },
        grid: {
          color: "rgba(255, 99, 132, 0.1)",
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: "Moisture (%)",
          color: "rgb(54, 162, 235)",
          font: {
            size: 12,
          },
        },
        min: 0,
        max: 100,
        ticks: {
          color: "rgb(54, 162, 235)",
          stepSize: 10,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: "Conductivity (dS/m)",
          color: "rgb(75, 192, 192)",
          font: {
            size: 12,
          },
        },
        min: 0,
        max: 4,
        ticks: {
          color: "rgb(75, 192, 192)",
          stepSize: 0.5,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y3: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: "pH",
          color: "rgb(153, 102, 255)",
          font: {
            size: 12,
          },
        },
        min: 0,
        max: 14,
        ticks: {
          color: "rgb(153, 102, 255)",
          stepSize: 1,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="rounded-md bg-primary/30 text-sm text-white px-4 py-2">
          Soil Sensors
        </h1>
        <Button className="flex items-center gap-2">
          <PlayCircle size={16} /> Record Value (12s)
        </Button>
      </div>
      <div className="flex-1 min-h-[300px]">
        <Line 
          data={sensorData} 
          options={options}
          height={null}
          width={null}
        />
      </div>
    </div>
  );
};

export default SoilSensorGraph;