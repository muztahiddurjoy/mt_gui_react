"use client";
import {
  Circle,
  MapContainer as Container,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet-rotatedmarker";
import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
// import 'leaflet.offline';
import "leaflet/dist/leaflet.css";
import TopBar from "./dashboard/top-bar/top-bar";
import { FlagIcon, FlagTriangleRight, Map } from "lucide-react";
import { Button } from "./ui/button";
import WaypointContainer from "./way-point-container/way-point-container";
import { toast } from "sonner";
import { renderToString } from "react-dom/server";
import { Colors } from "./way-point-container/data/colors";
import MapMenubar from "./map-menubar/map-menubar";
import OrientationContainer from "./orientation-container/orientation-container";
import { getROS } from "@/ros-functions/connect";
import ROSLIB, { Ros } from "roslib";
import RoverFollower from "./rover-follower";
import {
  degreeToRadian,
  radianToDegree,
} from "./orientation-container/angle-container/angle-container";
import { calculateDistance } from "./orientation-container/distance-calculator/functions/calculate-distance";
import TestComponent from "./dashboard/test-component";
import MapController from "./dashboard/test-component";
import { topics } from "@/topics";
import { WayPointType } from "@/types/WaypointType";
import { WayPoint } from "@/types/Waypoint";
import { Coordinate } from "@/types/Coordinate";
import { getInitial } from "@/functions/getInitials";
import { getColor } from "@/functions/getColor";
import RoverMarker from "./autonomous/markers/rover-marker";

const MapContainer = () => {
  const [waypoints, setwaypoints] = useState<WayPoint[]>([]);
  const [selectedWaypoint, setselectedWaypoint] = useState<WayPoint | null>(
    null,
  );
  const [wptype, setwptype] = useState<WayPointType>(WayPointType.GNSS);
  const [mapActive, setmapActive] = useState<boolean>(false);
  const [roverPosition, setroverPosition] = useState<Coordinate>({
    lat: 38.42390688,
    lng: -110.7852678,
  });
  const [roverRotation, setroverRotation] = useState(Math.PI);
  const [roverPositions, setroverPositions] = useState<Coordinate[]>([]);
  const [ros, setros] = useState<Ros | null>(null);
  const [isRosConnected, setisRosConnected] = useState<boolean>(false);

  const [selectedWaypoints, setselectedWaypoints] = useState<WayPoint[]>([]);

  const MapClickHandler = () => {
    if (mapActive) {
      useMapEvents({
        click(e) {
          setwaypoints([
            ...waypoints,
            {
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              id: waypoints.length,
              type: wptype,
              name: `${getInitial(wptype)}${waypoints.filter((v) => v.type == wptype).length + 1}`,
            },
          ]);
        },
      });
    }
    return null;
  };

  useEffect(() => {
    setwaypoints(JSON.parse(localStorage.getItem("waypoints") || "[]"));
    getROS().then((ros) => {
      ros.on("connection", () => {
        setisRosConnected(true);
      });
      setros(ros);
      ros.on("close", () => {
        setisRosConnected(false);
      });
    });
    return () => {
      if (ros) {
        ros.close();
      }
    };
  }, []);

  useEffect(() => {
    if (roverPositions.length > 0) {
      const distance = calculateDistance(
        Number(roverPosition.lat),
        Number(roverPosition.lng),
        Number(roverPositions[roverPositions.length - 1].lat),
        Number(roverPositions[roverPositions.length - 1].lng),
      );
      console.log(distance);
      if (distance > 0.7) {
        setroverPositions((p) => [...p, roverPosition]);
      }
    } else {
      if (roverPosition.lat != 0.0 && roverPosition.lng != 0.0) {
        setroverPositions((p) => [...p, roverPosition]);
      }
    }
  }, [roverPosition]);

  useEffect(() => {
    getROS().then((ros) => {
      if (ros.isConnected) {
        const angleTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics["yaw"].name,
          messageType: topics["yaw"].messageType,
        });
        const gpsTopic = new ROSLIB.Topic({
          ros: ros,
          name: topics["gps"].name,
          messageType: topics["gps"].messageType,
        });

        angleTopic.subscribe((msg: any) => {
          // console.log(msg)
          setroverRotation(msg.data);
        });

        gpsTopic.subscribe((msg: any) => {
          console.log("gps", msg);
          setroverPosition({
            lat: msg.latitude,
            lng: msg.longitude,
          });
          console.log(msg.latitude, msg.longitude);
        });

        console.log("subscribed to", angleTopic.name);
        console.log("gps", gpsTopic.name);
      } else {
        toast.error("Cannot subscribe to angle topic. ROS not connected");
      }
    });
  }, []);

  useEffect(() => {
    if (waypoints) {
      localStorage.setItem("waypoints", JSON.stringify(waypoints));
    }
  }, [waypoints]);

  const clearRoverWaypoints = () => {
    setroverPositions([]);
  };

  return (
    <div className="relative">
      <div
        className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[7vh] left-[50%] font-bold absolute z-50 bg-orange-500/50"
        onClick={clearRoverWaypoints}
      >
        N
      </div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[93vh] left-[50%] font-bold absolute z-50 bg-sky-500/50">
        S
      </div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[45vh] left-[20%] font-bold absolute z-50 bg-purple-500/50">
        W
      </div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[45vh] right-[15%] font-bold absolute z-50 bg-red-500/50">
        E
      </div>
      <OrientationContainer rover={roverPosition} waypoints={waypoints} />
      <Container
        center={[Number(roverPosition.lat), Number(roverPosition.lng)]}
        style={{
          position: "fixed",
          height: "93vh",
          width: "65%",
          marginLeft: "20%",
          marginTop: "7vh",
        }}
        zoom={100}
        scrollWheelZoom={true}
      >
        <TileLayer
          maxZoom={25}
          maxNativeZoom={19}
          //  url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga"
          url="http://localhost:8080/tiles/google_maps/webmercator/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open Street Map</a> Contributors'
        />

        <MapClickHandler />
        {waypoints.map((waypoint, index) => {
          const waypointIcon = L.divIcon({
            html: `<div class="flex flex-col items-center">
        ${renderToString(
          <div className="relative">
            <div
              className={`h-[40px] w-[2px] ${getColor(waypoint.type)}`}
            ></div>
            <div
              className={`h-[20px] absolute top-0 left-0 w-[40px] ${getColor(waypoint.type)} text-xs flex items-center justify-center text-white`}
            >
              {waypoint.name}
            </div>
          </div>,
        )}
       
        </div>`,
            className: `w-20 h-20 `,
            iconSize: [40, 40],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
          return (
            <div key={waypoint.id}>
              <Circle
                center={[waypoint.lat, waypoint.lng]}
                radius={
                  waypoint.type === WayPointType.GNSS
                    ? 2
                    : waypoint.type === WayPointType.ARUCO
                      ? 5
                      : 10
                } // 3 meters
                pathOptions={{
                  color: getColor(waypoint.type), // Border color matches waypoint
                  fillColor:
                    waypoint.type == WayPointType.ARUCO
                      ? "amber"
                      : waypoint.type == WayPointType.BOTTLE
                        ? "teal"
                        : waypoint.type == WayPointType.GNSS
                          ? "blue"
                          : "orange", // Fill color matches waypoint
                  fillOpacity: 0.2, // Semi-transparent fill
                  weight: 1, // Border thickness
                }}
              />
              <Marker
                icon={waypointIcon}
                position={[waypoint.lat, waypoint.lng]}
                autoPanOnFocus={true}
                eventHandlers={{
                  click: () => {
                    setselectedWaypoint(waypoint);
                  },
                }}
              ></Marker>
            </div>
          );
        })}
        <RoverMarker
          roverPosition={roverPosition}
          roverRotation={roverRotation}
        />
        <Polyline
          positions={waypoints.map((waypoint) => [waypoint.lat, waypoint.lng])}
          pathOptions={{ color: "#00249c" }}
          dashArray={[3, 10]}
        />
        <MapController roverPos={roverPosition} />

        <Polyline
          positions={roverPositions.map((waypoint) => [
            Number(waypoint.lat),
            Number(waypoint.lng),
          ])}
          pathOptions={{ color: "red" }}
        />
      </Container>
      {/* <div className='fixed bottom-0 ml-[20%] w-full'>   
  <MapMenubar mapActive={mapActive} setMapActive={setmapActive} setWaypoint={setwaypoints} wayPoints={waypoints} setwpType={setwptype} wpType={wptype}/>
</div> */}

      <WaypointContainer
        selectedWaypoints={selectedWaypoints}
        setSelectedWaypoints={setselectedWaypoints}
        setSelectedWaypoint={setselectedWaypoint}
        setWaypoints={setwaypoints}
        selectedWaypoint={selectedWaypoint}
        waypoints={waypoints}
      />
    </div>
  );
};

export default MapContainer;
