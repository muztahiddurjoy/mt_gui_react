"use client"
import { ArcElement, Legend, Tooltip } from 'chart.js';
import ChartJS from 'chart.js/auto';
import React from 'react'
import { Line } from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend);  

const OthersGraphs = () => {
  const data = {
    labels: ['1s','2s','3s','4s','5s','6s','7s','8s','9s','10s','11s','12s'],
    datasets: [
      {
        label: 'Intensity Of Light (lux)',
        data: [300, 320, 310, 330, 340, 350, 360, 370, 380, 390, 400, 410],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Pressure (hPa)',
        data: [1012, 1013, 1011, 1014, 1015, 1013, 1012, 1011, 1010, 1013, 1014, 1015],
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Humidity (%)',
        data: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Oxygen Concentration (%)',
        data: [21, 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8, 21.9, 22, 22.1],
        fill: false,
        backgroundColor: 'rgb(153, 102, 255)',
        borderColor: 'rgba(153, 102, 255, 0.2)',
      },
      {
        label: 'Temperature (°C)',
        data: [22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5],
        fill: false,
        backgroundColor: 'rgb(255, 159, 64)',
        borderColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Carbon Monoxide (ppm)',
        data: [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6],
        fill: false,
        backgroundColor: 'rgb(255, 206, 86)',
        borderColor: 'rgba(255, 206, 86, 0.2)',
      },
      {
        label: 'Altitude (m)',
        data: [100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          color: 'white' // Change this to your desired color
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.2)' // Change this to your desired color
        }
      },
      y: {
        ticks: {
          color: 'white' // Change this to your desired color
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.2)' // Change this to your desired color
        }
      }
    }
  };
  
  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <Line data={data} options={options} />
    </div>
  )
}

export default OthersGraphs