import { WayPointType } from "./WaypointType";

export interface WayPoint{
    lat:number;
    lng:number;
    id:number;
    type:WayPointType;
    name:string;
  }
  