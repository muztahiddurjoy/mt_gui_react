import { WayPointType } from "@/types/WaypointType";

export const getInitial = (type: WayPointType): string => {
  switch (type) {
    case WayPointType.ARUCO:
      return "AR";
    case WayPointType.BOTTLE:
      return "BT";
    case WayPointType.GNSS:
      return "GNSS";
    case WayPointType.MALLETE:
      return "ML";
  }
};
