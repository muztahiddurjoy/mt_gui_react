import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import AddLatLonWaypoint from "./add-latlon-waypoint/add-latlon-waypoint";
import SelectedWaypoint from "./selected-waypoint/selected-waypoint";
import { Colors } from "./data/colors";
import WaypointAdapter from "./way-point-adapter/way-point-adapter";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { WayPoint } from "@/types/Waypoint";
import { WayPointType } from "@/types/WaypointType";
import { getInitial } from "@/functions/getInitials";

interface WaypointContainerProps {
  waypoints: WayPoint[];
  selectedWaypoint: WayPoint | null;
  selectedWaypoints: WayPoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<WayPoint[]>>;
  setSelectedWaypoint: React.Dispatch<React.SetStateAction<WayPoint | null>>;
  setSelectedWaypoints: React.Dispatch<React.SetStateAction<WayPoint[]>>;
}

const WaypointContainer = (props: WaypointContainerProps) => {
  //states
  const [waypoint, setwaypoint] = useState<WayPoint>({
    id: props.waypoints.length,
    lat: 0,
    lng: 0,
    type: WayPointType.GNSS,
    name: `${getInitial(WayPointType.GNSS)}${props.waypoints.filter((v) => v.type == WayPointType.GNSS).length + 1}`,
  });

  const [showDeleteDialog, setshowDeleteDialog] = useState<boolean>(false);

  const deleteAllWaypoints = () => {
    props.setWaypoints((prev) =>
      prev.filter((wp) => !props.selectedWaypoints.includes(wp)),
    );
    props.setSelectedWaypoints([]);
    props.setSelectedWaypoint(null);
    setshowDeleteDialog(false);
  };

  return (
    <div className="mt-[7vh] grid grid-rows-3 fixed top-0 right-0 w-[15%] h-[100vh] gap-3 p-1">
      <ScrollArea className="h-[100vh] pb-[7vh]">
        {props.selectedWaypoint && (
          <SelectedWaypoint
            selectedWaypoint={props.selectedWaypoint}
            setSelectedWaypoint={props.setSelectedWaypoint}
            setWaypoints={props.setWaypoints}
            waypoints={props.waypoints}
          />
        )}
        <AddLatLonWaypoint
          setWaypoints={props.setWaypoints}
          waypoints={props.waypoints}
          waypoint={waypoint}
          setWaypoint={setwaypoint}
        />
        <Card className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Checkbox
                id="checkAll"
                checked={
                  props.selectedWaypoints.length == props.waypoints.length
                }
                onCheckedChange={(e) => {
                  if (e) {
                    props.setSelectedWaypoints(props.waypoints);
                  }
                }}
              />
              <label htmlFor="checkAll" className="text-xs">
                All Waypoint
              </label>
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setshowDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  className="w-[10px] h-[25px]"
                  disabled={props.selectedWaypoints.length == 0}
                  variant="destructive"
                >
                  <Trash2 size={10} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    Are you sure that you want to delete all selected waypoints?
                    <div className="flex justify-end mt-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={deleteAllWaypoints}
                      >
                        Yes
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          {props.waypoints
            .sort((a, b) => a.id - b.id)
            .map((waypoint, index) => (
              <WaypointAdapter
                index={props.waypoints.findIndex(
                  (v) => v.lat == waypoint.lat && v.lng == waypoint.lng,
                )}
                waypoint={waypoint}
                key={index}
                {...props}
              />
            ))}
        </Card>
      </ScrollArea>
    </div>
  );
};

export default WaypointContainer;
