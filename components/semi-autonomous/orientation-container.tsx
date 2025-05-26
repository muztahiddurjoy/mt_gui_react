import React, { Dispatch, SetStateAction } from "react";
import { Card } from "../ui/card";
import AngleContainer from "../autonomous/orientation-container/angle-container/angle-container";
import CompassContainer from "../autonomous/orientation-container/compass-container/compass-container";
import DeliveryAddContainer, { DeliveryMission } from "./delivery-add-container";
import { Coordinate } from "./MapContainer";

interface OrientationContainerProps {
  deliveryCoord: Coordinate | null;
  setDeliverCoord: Dispatch<SetStateAction<Coordinate | null>>;
  deliveryBound: number
  setDeliveryBound: Dispatch<SetStateAction<number>>;
}

const OrientationContainer = (props: OrientationContainerProps) => {
  return (
    <div className="h-[93vh] fixed bottom-0 top-0 left-0 w-[20%] pt-[7vh]">
      {/* <DistanceCalculator {...props}/> */}
      {/* <AngleContainer /> */}
      <CompassContainer />
      <DeliveryAddContainer bound={props.deliveryBound} coord={props.deliveryCoord} setBound={props.setDeliveryBound} setCoord={props.setDeliverCoord}/>
    </div>
  );
};

export default OrientationContainer;
