import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Delete,
  Edit2,
  Hammer,
  MapPin,
  Milk,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Colors } from "../data/colors";
import { getWaypointType } from "@/functions/getWaypointType";
import { WayPoint } from "@/types/Waypoint";
import { WayPointType } from "@/types/WaypointType";
import { getColor } from "@/functions/getColor";
import { getInitial } from "@/functions/getInitials";
interface WaypointAdapterProps {
  index: number;
  waypoint: WayPoint;
  selectedWaypoint: WayPoint | null;
  setSelectedWaypoint: React.Dispatch<React.SetStateAction<WayPoint | null>>;
  setWaypoints: React.Dispatch<React.SetStateAction<WayPoint[]>>;
  selectedWaypoints: WayPoint[];
  setSelectedWaypoints: React.Dispatch<React.SetStateAction<WayPoint[]>>;
  waypoints: WayPoint[];
}

const WaypointAdapter = (props: WaypointAdapterProps) => {
  const [pointSelected, setpointSelected] = useState<boolean>(false);
  const [showLatlon, setshowLatlon] = useState<boolean>(false);
  const [deleteOpen, setdeleteOpen] = useState<boolean>(false);
  const [showEdit, setshowEdit] = useState<boolean>(false);
  const [templatlng, settemplatlng] = useState<{ lat: number; lng: number }>({
    lat: props.waypoint.lat,
    lng: props.waypoint.lng,
  });
  const [tempType, settempType] = useState<WayPointType>(props.waypoint.type);
  const [tempName, settempName] = useState<string>(props.waypoint.name);

  const addWaypointToSelected = () => {
    if (props.selectedWaypoints.find((wp) => wp.id === props.waypoint.id)) {
      props.setSelectedWaypoints(
        props.selectedWaypoints.filter((wp) => wp.id !== props.waypoint.id),
      );
    } else {
      props.setSelectedWaypoints([...props.selectedWaypoints, props.waypoint]);
    }
  };

  const copyLatLon = () => {
    navigator.clipboard
      .writeText(`${props.waypoint.lat}, ${props.waypoint.lng}`)
      .then(() => {
        toast({
          title: "Copied",
          description: "Latitude and Longitude copied to clipboard",
        });
      })
      .catch((err) => {
        console.log(err);
        toast({ title: "Failed", description: "Failed to copy lat/lon" });
      });
  };

  const bringUp = () => {
    const index = props.waypoints.findIndex(
      (wp) => wp.id === props.waypoint.id,
    );
    console.log(index);
    if (index > 0) {
      const temp = [...props.waypoints];
      const tempIndex = temp[index].id;
      temp[index].id = tempIndex - 1;
      temp[index - 1].id = tempIndex;
      props.setWaypoints(temp);
    }
  };

  const bringDown = () => {
    const index = props.waypoints.findIndex(
      (wp) => wp.id === props.waypoint.id,
    );
    if (index < props.waypoints.length - 1) {
      const temp = [...props.waypoints];
      const tempIndex = temp[index].id;
      temp[index].id = tempIndex + 1;
      temp[index + 1].id = tempIndex;
      props.setWaypoints(temp);
    }
  };

  const editWaypoint = () => {
    props.setWaypoints((p) =>
      p.map((wp) => {
        if (wp.id === props.waypoint.id) {
          return {
            ...wp,
            name: tempName,
            lat: templatlng.lat,
            lng: templatlng.lng,
            type: tempType,
          };
        }
        return wp;
      }),
    );
    setshowEdit(false);
  };

  useEffect(() => {
    if (props.selectedWaypoints.find((wp) => wp.id === props.waypoint.id)) {
      setpointSelected(true);
    } else {
      setpointSelected(false);
    }
  }, [props.selectedWaypoints]);

  const deleteWaypoint = () => {
    props.setWaypoints((p) => p.filter((wp) => wp.id !== props.waypoint.id));
    props.setSelectedWaypoints((p) =>
      p.filter((wp) => wp.id !== props.waypoint.id),
    );
    setdeleteOpen(false);
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mt-1 justify-between p-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`wp-${props.waypoint.id}`}
            onCheckedChange={addWaypointToSelected}
            checked={pointSelected}
          />
          {props.waypoint.type == WayPointType.GNSS ? (
            <MapPin size={15} className="text-blue-500" />
          ) : props.waypoint.type == WayPointType.BOTTLE ? (
            <Milk className="stroke-teal-700 fill-teal-500" size={15} />
          ) : props.waypoint.type == WayPointType.ARUCO ? (
            <img src="/marker/aruco.png" className="h-[20px]" />
          ) : (
            <Hammer className="fill-orange-500 stroke-orange-500" size={15} />
          )}
          <label className="text-xs" htmlFor={`wp-${props.waypoint.id}`}>
            {props.waypoint.name}
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="w-[10px] h-[20px]"
              onClick={bringDown}
              size="sm"
            >
              <ArrowDown size={10} />
            </Button>
            <Button
              variant="outline"
              className="w-[10px] h-[20px]"
              onClick={bringUp}
              size="sm"
            >
              <ArrowUp size={10} />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setshowEdit(true)}
              className={buttonVariants({
                size: "sm",
                variant: "outline",
                className: "w-[10px] h-[20px]",
              })}
            >
              <Edit2 size={8} />
            </Button>
            <Dialog open={showEdit} onOpenChange={setshowEdit}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-primary">
                    Edit Waypoint
                  </DialogTitle>
                  <DialogDescription>
                    <div className="flex items-center gap-2 mb-2 justify-between">
                      <p className="text-xs font-semibold">
                        Coordinates:
                        <span className="text-xs">
                          {" "}
                          {props.waypoint.lat}, {props.waypoint.lng}
                        </span>
                      </p>
                      <Button
                        className="text-xs"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${props.waypoint.lat}, ${props.selectedWaypoint?.lng}`,
                          );
                          toast({
                            title: "Copied",
                            description: "Coordinates copied to clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <label>Name</label>
                    <Input
                      type="text"
                      value={tempName}
                      onChange={(e) => settempName(e.target.value)}
                      placeholder="Name"
                    />
                    <div className="flex items-center gap-2">
                      <div>
                        <label className="text-xs font-semibold">Label</label>
                        <br />
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div
                              className={`h-[30px] mt-1 w-[50px] rounded-sm ${getColor(tempType)} flex items-center justify-center text-white`}
                            >
                              {getInitial(tempType)}
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel className="text-xs font-semibold">
                              Waypoint Tag
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                              onValueChange={(e) => console.log(typeof e)}
                            >
                              {Object.keys(WayPointType).map((value, key) => {
                                return (
                                  Number.isNaN(parseInt(value)) && (
                                    <DropdownMenuRadioItem
                                      value={value}
                                      key={key}
                                      onClick={() =>
                                        settempType(getWaypointType(value))
                                      }
                                      className={`${value}`}
                                    >
                                      {value}
                                    </DropdownMenuRadioItem>
                                  )
                                );
                              })}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <label className="text-xs font-semibold">
                          Latitude
                        </label>
                        <Input
                          type="text"
                          className="w-full mt-1 p-1 border border-gray-300"
                          value={templatlng.lat}
                          onChange={(e) => {
                            settemplatlng((p) => ({
                              ...p,
                              lat: parseFloat(e.target.value),
                            }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs mt-1 font-semibold">
                          Longitude
                        </label>
                        <Input
                          type="text"
                          className="w-full mt-1 p-1 border border-gray-300"
                          value={templatlng.lng}
                          onChange={(e) => {
                            settemplatlng((p) => ({
                              ...p,
                              lng: parseFloat(e.target.value),
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button
                        onClick={editWaypoint}
                        disabled={
                          (templatlng.lat == 0 && templatlng.lng == 0) ||
                          !tempName
                        }
                      >
                        Save
                      </Button>
                    </div>
                    {/* <Button onClick={editWaypoint} disabled={Number.isNaN(props.selectedWaypoint.lat) || Number.isNaN(props.selectedWaypoint.lng)} className='text-xs mt-1 w-full text-white' size='sm'>Save</Button> */}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              className="w-[10px] h-[20px]"
              onClick={() => setdeleteOpen(true)}
              size="sm"
            >
              <Trash2 size={8} />
            </Button>

            <Dialog open={deleteOpen} onOpenChange={setdeleteOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    Are you sure that you want to delete this waypoint?
                    <div className="flex justify-end mt-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={deleteWaypoint}
                      >
                        Yes
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {
        <div className="w-full px-1">
          <p className="text-xs">Lat {props.waypoint.lat}</p>
          <p className="text-xs">Lon {props.waypoint.lng}</p>
          <Button size="sm" className="w-full my-1" onClick={copyLatLon}>
            <Copy /> Copy
          </Button>
        </div>
      }
    </Card>
  );
};

export default WaypointAdapter;
