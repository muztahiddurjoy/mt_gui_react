"use client";
import React, { use, useEffect, useState } from "react";
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

ChartJS.register(ArcElement, Tooltip, Legend);
const ScienceGraphs = () => {
  const [values, setvalues] = useState<string[]>([
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ]);
  useEffect(() => {
    getROS().then((ros) => {
      const sensorTopic = new ROSLIB.Topic({
        ros: ros,
        name: "/sensors",
        messageType: "std_msgs/String",
      });

      sensorTopic.subscribe((message: any) => {
        console.log("Received message on /sensors:", message);
        const processed = String(message.data).replace("\r\n", "").split(",");
        setvalues(processed);
      });
    });
  }, []);
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    console.log("CONC ", values[values.length - 1]);
    console.log("UV ", values[values.length - 2]);
  }, [values]);

  return (
    <div className="pt-20 px-10">
      <div className="grid mt-5 grid-cols-3  gap-10 pb-20">
        {/* <UvGraph data={values[values.length-1]}/> */}
        {/* <NPKGraph/> */}

        {/* <OthersGraphs/> */}
        {/* <OthersFour/> */}
        {/* <UvGraph data={values[values.length-2]}/>
        <ConcGraph data={values[values.length-1]}/> */}
        <HumidityGraph data={values[0]} />
        <ConcUV
          concData={values[values.length - 1]}
          uvData={values[values.length - 2]}
        />
        <PressureAlt
          data1={values[values.length - 4]}
          data2={values[values.length - 3]}
        />
        <LightHumidityGraph humidityData={values[1]} lightData={values[2]} />
        {/* <ColorSensorGraphs/> */}
      </div>
    </div>
  );
};

export default ScienceGraphs;
