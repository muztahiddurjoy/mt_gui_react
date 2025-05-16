import { Coordinate } from "@/types/Coordinate";
import React, { useEffect, useRef } from "react";
import { Marker, MarkerProps, Popup } from "react-leaflet";
import L from "leaflet";
interface RoverMarkerProps {
  roverPosition: Coordinate;
  roverRotation: number;
}

const roverIcon = new L.Icon({
  iconUrl: "/marker/rover-marker.png",
  className: "transition-transform duration-100 ease-in-out",
  iconSize: [30, 30],
  iconAnchor: [17, 35],
  popupAnchor: [1, -34],
  // shadowSize: [41, 41]
});

const RoverMarker = ({ roverPosition, roverRotation }: RoverMarkerProps) => {
  const roverMarker = useRef(null);

  useEffect(() => {
    if (roverMarker.current) {
      console.log("Setting rotation angle:", roverRotation);
      (roverMarker.current as any).setRotationAngle(roverRotation);
      (roverMarker.current as any).setRotationOrigin("center");
    }
  }, [roverRotation]);
  return (
    <Marker
      ref={roverMarker}
      icon={roverIcon}
      position={[Number(roverPosition.lat), Number(roverPosition.lng)]}
    >
      <Popup>Rover is currently here</Popup>
    </Marker>
  );
};

export default RoverMarker;
