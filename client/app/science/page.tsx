"use client"
import React, { useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import UvGraph from '@/components/science/uv-graph';
import NPKGraph from '@/components/science/npk-graph';
import OthersGraphs from '@/components/science/others';
import ColorSensorGraphs from '@/components/science/color-sensor';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import OthersFour from '@/components/science/other-four';
import CO2Graph from '@/components/science/co2-sensor';

ChartJS.register(ArcElement, Tooltip, Legend);
const ScienceGraphs = () => {
    useEffect(() => {
        
    }, [])
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    
  return (
    <div className='pt-20 px-10'>
       
    <div className='grid mt-5 grid-cols-2  gap-10 pb-20'>
    <UvGraph/>
    <NPKGraph/>
    
        <OthersGraphs/>
        <OthersFour/>
        <CO2Graph/>
        <ColorSensorGraphs/>
    
    </div>
    </div>
  )
}

export default ScienceGraphs