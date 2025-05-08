import { WayPointType } from "@/components/MapContainer"

export const getWaypointType = (waypoint: string): WayPointType => {
    switch (waypoint) {
        case "GNSS":
            return WayPointType.GNSS
        case "ARUCO":
            return WayPointType.ARUCO
        case "MALLETE":
            return WayPointType.MALLETE
        case "BOTTLE":
            return WayPointType.BOTTLE
        default:
            return WayPointType.GNSS
    }
}