"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DualGraphProps {
  uvData: string; // Single UV reading as string (e.g., "2.5")
  concData: string; // Single CONC reading as string (e.g., "5.2")
}

const ConcUV = ({ uvData, concData }: DualGraphProps) => {
  // State to store the last 12 readings for both metrics
  const [uvReadings, setUvReadings] = useState<number[]>(Array(12).fill(0));
  const [concReadings, setConcReadings] = useState<number[]>(Array(12).fill(0));
  
  // Update readings when new data comes in
  useEffect(() => {
    if (uvData) {
      const newValue = parseFloat(uvData);
      if (!isNaN(newValue)) {
        setUvReadings(prev => [...prev.slice(1), newValue]);
      }
    }
  }, [uvData]);

  useEffect(() => {
    if (concData) {
      const newValue = parseFloat(concData);
      if (!isNaN(newValue)) {
        setConcReadings(prev => [...prev.slice(1), newValue]);
      }
    }
  }, [concData]);

  // Chart data configuration
  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`),
    datasets: [
      {
        label: 'UV Power (mW/cm²)',
        data: uvReadings,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.8)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(255, 99, 132)',
        yAxisID: 'y',
      },
      {
        label: 'CO (ppm)',
        data: concReadings,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.8)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          color: 'cyan',
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.2)',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 30,
        ticks: {
          color: 'rgb(255, 99, 132)',
          stepSize: 1
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.2)',
        },
        title: {
          display: true,
          text: 'UV Power (mW/cm²)',
          color: 'rgb(255, 99, 132)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 30,
        ticks: {
          color: 'rgb(75, 192, 192)',
          stepSize: 1
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
        title: {
          display: true,
          text: 'CO (ppm)',
          color: 'rgb(75, 192, 192)'
        }
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'cyan',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      }
    }
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end mb-2">
        <span className='text-xs'>
          Last Values: UV {uvReadings[uvReadings.length-1]} mW/cm² | CONC {concReadings[concReadings.length-1]} ppm
        </span>
      </div>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ConcUV;