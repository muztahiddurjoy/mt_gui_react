"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Coordinate } from "../MapContainer";
import { getROS } from "@/ros-functions/connect";
import ROSLIB from "roslib";

interface MapControllerProps {
  roverPos: Coordinate;
}

const MapController = (props: MapControllerProps) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.flyTo(props.roverPos, map.getZoom());
    }
    //  map.flyTo

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "L" || event.key === "l") {
        goRTK();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    const goRTK = () => {
      map.flyTo(props.roverPos, 30);
      getROS()
        .then((ros) => {
          const rtkTopic = new ROSLIB.Topic({
            ros: ros,
            name: "/rtk",
            messageType: "std_msgs/Bool",
          });
          const msg = new ROSLIB.Message({
            data: true,
          });
          rtkTopic.publish(msg);
          rtkTopic.subscribe((msg) => {
            console.log(msg);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [props]);
  return <></>;
};

export default MapController;
