"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Button } from '../ui/button';
import { PlayCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface UvGraphProps {
  data1: string; 
  data2: string;
}

const PressureAlt = ({ data1, data2 }: UvGraphProps) => {
  // State to store the last 12 readings
  const [readings1, setReadings1] = useState<number[]>(Array(12).fill(0));
  const [readings2, setReadings2] = useState<number[]>(Array(12).fill(0));
  
  // Update readings when new data comes in
  useEffect(() => {
    if (data1 && data2) {
      const newValue1 = parseFloat(data1);
      const newValue2 = parseFloat(data2);
      if (!isNaN(newValue1) && !isNaN(newValue2)) {
        setReadings1(prev => [...prev.slice(1), (newValue1/1000)]);
        setReadings2(prev => [...prev.slice(1), newValue2]);
      }
    }
  }, [data1, data2]);

  // Chart data configuration
  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${i + 1}s`),
    datasets: [
      {
        label: 'Pressure (kPa)',
        data: readings1,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.8)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(255, 99, 132)'
      },
      {
        label: 'Altimeter (m)',
        data: readings2,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.8)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(75, 192, 192)'
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: 'pink',
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.2)',
        },
      },
      y: {
        min: 0,
        max: 500,
        ticks: {
          color: 'pink',
          stepSize: 1
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.2)',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'pink',
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
          Last Values: {readings1[readings1.length-1]}kPa | {readings2[readings2.length-1]}m
        </span>
      </div>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PressureAlt;