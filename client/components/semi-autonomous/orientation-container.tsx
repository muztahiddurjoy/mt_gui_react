import React from "react";
import { Card } from "../ui/card";
import AngleContainer from "../orientation-container/angle-container/angle-container";
import CompassContainer from "../orientation-container/compass-container/compass-container";
import { Coordinate } from "@/types/Coordinate";
import { WayPoint } from "@/types/Waypoint";

interface OrientationContainerProps {
  waypoints: WayPoint[];
  rover: Coordinate;
}

const OrientationContainer = (props: OrientationContainerProps) => {
  return (
    <div className="h-[93vh] fixed bottom-0 top-0 left-0 w-[20%] pt-[7vh]">
      {/* <DistanceCalculator {...props}/> */}
      <AngleContainer />
      <CompassContainer />
    </div>
  );
};

export default OrientationContainer;
