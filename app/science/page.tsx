  "use client";
  import React, { useEffect, useState } from "react";
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
  import { Doughnut } from "react-chartjs-2";
  import UvGraph from "@/components/science/uv-graph";
  import NPKGraph from "@/components/science/npk-graph";
  import OthersGraphs from "@/components/science/others";
  import ColorSensorGraphs from "@/components/science/color-sensor";
  import { Button } from "@/components/ui/button";
  import { PlayCircle } from "lucide-react";
  import OthersFour from "@/components/science/other-four";
  import CO2Graph from "@/components/science/co2-sensor";
  import ROSLIB, { Topic, Message } from "roslib";
  import { getROS } from "@/ros-functions/connect";
  import ConcGraph from "@/components/science/conc-uv";
  import PressureAlt from "@/components/science/pressure-alt";
  import ConcUV from "@/components/science/conc-uv";
  import LightHumidityGraph from "@/components/science/light-gas";
  import HumidityGraph from "@/components/science/humidity-graph";
  import SoilSensorGraph from "@/components/science/soil-temp-and-conductivity";
  import { topics } from "@/topics";

  ChartJS.register(ArcElement, Tooltip, Legend);

  const ScienceGraphs = () => {
    const [sensorData, setSensorData] = useState({
      humidity: 0,
      temperature: 0,
      oxygen: 0,
      light: 0,
      pressure: 0,
      altitude: 0,
      uv: 0,
      concentration: 0,
      soilTemperature: 0,
      soilConductivity: 0,
    });

    useEffect(() => {
      getROS().then((ros) => {
        // Create subscribers for each sensor
        const createSubscriber = (sensorName: string) => {
          const topic = new ROSLIB.Topic({
            ros: ros,
            name: topics[sensorName].name,
            messageType: topics[sensorName].messageType,
          });

          topic.subscribe((message: any) => {
            setSensorData(prev => ({
              ...prev,
              [sensorName]: message.data
            }));
          });
        };

        // Subscribe to all sensor topics
        createSubscriber('humidity');
        createSubscriber('light');
        createSubscriber('temperature');
        createSubscriber('oxygen');
        createSubscriber('pressure');
        createSubscriber('altitude');
        createSubscriber('uv');
        createSubscriber('concentration');
        createSubscriber('soil_temperature');
        createSubscriber('soil_conductivity');
      });
    }, []);

    return (
      <div className="pt-20 px-10">
        <div className="grid mt-5 grid-cols-3 gap-10 pb-20">
          <NPKGraph />
          <SoilSensorGraph
            temperature={sensorData.soilTemperature} 
            conductivity={sensorData.soilConductivity} 
          />
          <HumidityGraph data={sensorData.humidity} />
          <ConcUV
            concData={sensorData.concentration}
            uvData={sensorData.uv}
          />
          <PressureAlt
            data1={sensorData.pressure}
            data2={sensorData.altitude}
          />
          <LightHumidityGraph 
            humidityData={sensorData.humidity} 
            lightData={sensorData.light} 
          />
        </div>
      </div>
    );
  };

  export default ScienceGraphs;