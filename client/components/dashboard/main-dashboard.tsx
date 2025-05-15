"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import TopBar from "./top-bar/top-bar";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux /store";
import { useAppDispatch } from "@/hooks/redux-hook";
import { getROS } from "@/ros-functions/connect";
import { setConnected, setRos } from "@/redux /slices/ros-slice";
const MainDashboard = ({ children }: React.PropsWithChildren) => {
  const dis = useDispatch();
  // useEffect(() => {
  //   getROS().then((ros)=>{
  //     ros.on('connection',()=>{
  //       console.log('Connected to ROS')
  //       dis(setRos(ros))
  //       dis(setConnected(true))
  //     })
  //     ros.on('error',(error)=>{
  //       console.log('Error connecting to ROS:', error);
  //     })
  //     ros.on('close',()=>{
  //       console.log('Disconnected from ROS')
  //       dis(setConnected(false))
  //       dis(setRos(null))
  //     })

  //   })
  //   return (()=>{
  //     getROS().then((ros)=>{
  //       ros.close()
  //       dis(setConnected(false))
  //       dis(setRos(null))
  //     })
  //   })
  // }, [])

  return (
    <div className="h-[100vh]">
      <TopBar />
      {children}
    </div>
  );
};

export default MainDashboard;
