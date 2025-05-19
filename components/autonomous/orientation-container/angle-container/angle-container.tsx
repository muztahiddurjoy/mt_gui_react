"use client";
import { getROS } from "@/ros-functions/connect";
import { topics } from "@/topics";
import { Angle } from "@/types/Angle";
import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";
import { toast } from "sonner";







const AngleContainer = () => {
  const [angle, setangle] = useState<Angle>({
    pitch: 0.0,
    roll: 0.0,
    yaw: 0.0,
  });

  useEffect(() => {
    getROS().then((ros) => {
      if (ros.isConnected) {
        const yawTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics["yaw"].name,
          messageType: topics["yaw"].messageType,
        });

        const rollTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics["roll"].name,
          messageType: topics["roll"].messageType,
        });

        const pitchTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics["pitch"].name,
          messageType: topics["pitch"].messageType,
        });

        yawTopic.subscribe((msg: any) => {
          setangle((p) => ({
            ...p,
            yaw: msg.data,
          }));
        });
        rollTopic.subscribe((msg: any) => {
          setangle((p) => ({
            ...p,
            roll: msg.data,
          }));
        });
        pitchTopic.subscribe((msg: any) => {
          setangle((p) => ({
            ...p,
            pitch: msg.data,
        }));
      });
        console.log("subscribed to", yawTopic.name);
        console.log("subscribed to", rollTopic.name);
        console.log("subscribed to", pitchTopic.name);
      } else {
        toast.error("Cannot subscribe to angle topic. ROS not connected");
      }
    });
  }, []);

  return (
    <>
      <div className="flex items-center justify-center relative h-[170px]">
        <div className="h-[90%] w-[1px] bg-red-500 absolute top-2 left-[50%]">
          y
        </div>
        <div className="w-[90%] h-[1px] bg-green-500 absolute top-[50%] left-4">
          x
        </div>
        <img
          src="/bar.png"
          className="w-[90%] h-[50px] absolute top-[50%] left-4"
          style={{
            transform: `rotateX(${angle.pitch}deg) rotateY(${angle.roll}deg)`,
          }}
        />
        {/* <img src="/compass.png" className='w-[90%] absolute top-0 left-0 right-0 bottom-0 z-50'/> */}
      </div>
      <p className="text-xs ml-2">
        Roll:{angle.roll.toFixed(0)} Pitch:{angle.pitch.toFixed(0)} Yaw:
        {angle.yaw.toFixed(0)}
      </p>
    </>
  );
};

export default AngleContainer;
