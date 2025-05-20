"use client";
import { ModeToggle } from "@/components/mode-toggler";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/redux-hook";
import { getROS } from "@/ros-functions/connect";
import { topics } from "@/topics";
import {
  Camera,
  Circle,
  FlaskConical,
  Hammer,
  Keyboard,
  Loader2,
  Milk,
  Navigation,
  QrCode,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";
import { toast } from "sonner";

const TopBar = () => {
  const [isConnected, setisConnected] = useState(false);
  const [connectingRos, setconnectingRos] = useState<boolean>(false);
  const [rtk, setrtk] = useState<boolean>(false);
  const [lightStatus, setlightStatus] = useState("red");
  const [activePath, setactivePath] = useState<string>("/");

  const connectRos = () => {
    setconnectingRos(true);
    getROS()
      .then((ros) => {
        if (ros.isConnected) {
          setisConnected(true);
          const lightTopic = new ROSLIB.Topic({
            ros: ros,
            name: topics["autonomous_light"].name,
            messageType: topics["autonomous_light"].messageType,
          });
          lightTopic.subscribe((msg: any) => {
            console.log("light", msg);
            const status = String(msg.data);
            if (status.toLocaleLowerCase() === "red") {
              setlightStatus("red");
              // setaruco(false)
            } else if (status.toLocaleLowerCase() === "green") {
              setlightStatus("green");
              // setaruco(true)
            } else if (status.toLocaleLowerCase() === "blue") {
              setlightStatus("blue");
              // setmalette(true)
            }
          });
          const rtkTopic = new ROSLIB.Topic({
            ros: ros,
            name: "/rtk",
            messageType: "std_msgs/Bool",
          });
          rtkTopic.subscribe((msg: any) => {
            console.log("rtk", msg);
            if (msg.data) {
              setrtk(msg.data);
            }
          });
        }

        ros.on("error", (error) => {
          console.log("Error connecting to ROS:", error);
          toast.error("Error connecting to ROS. Check console");
          setisConnected(false);
        });
        ros.on("close", () => {
          setisConnected(false);
        });
      })
      .finally(() => {
        setconnectingRos(false);
      });
  };

  useEffect(() => {
    connectRos();
  }, []);

  const path = usePathname();
  useEffect(() => {
    setactivePath(path);
    console.log("PATH", path);
  }, [path]);

  // Use isActive in Link components with className like:
  // className={`${buttonVariants({className:"bg-white/10 hover:bg-white/30 dark:text-white",size:"sm"})} ${isActive('/path') ? 'bg-white/30' : ''}`}

  return (
    <div className="fixed top-0 left-0 right-0 h-[8vh] bg-primary/50 backdrop-blur-md flex items-center justify-between z-50">
      <div className="h-full flex items-center justify-center">
        <div className="py-2">
          <img src="/logo.png" className="w-[70px]" />
        </div>

        <div className="flex items-center gap-2 ml-3">
          <p className="text-sm">Status</p>

          <div
            className={`h-[20px] w-[20px] rounded-full ${lightStatus == "red" ? "bg-red-500" : "bg-gray-500"}`}
          ></div>
          <div
            className={`h-[20px] w-[20px] rounded-full ${lightStatus == "blue" ? "bg-blue-500" : "bg-gray-500"}`}
          ></div>
          <div
            className={`h-[20px] w-[20px] rounded-full ${lightStatus == "green" ? "bg-green-500 blink" : "bg-gray-500"}`}
          ></div>
        </div>
        
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className={buttonVariants({
            size: "sm",
            variant: activePath === "/" ? "default" : "menu",
          })}
        >
          <Navigation /> Autonomous
        </Link>
        <Link
          href="/semi-autonomous"
          className={buttonVariants({
            size: "sm",
            variant: activePath === "/semi-autonomous" ? "default" : "menu",
          })}
        >
          <Navigation /> Semi Auto
        </Link>
        <Link
          href="/camera-feed"
          className={buttonVariants({
            size: "sm",
            variant: activePath === "/camera-feed" ? "default" : "menu",
          })}
        >
          <Camera /> Camera
        </Link>
        <Link
          href="/science"
          className={buttonVariants({
            size: "sm",
            variant: activePath === "/science" ? "default" : "menu",
          })}
        >
          <FlaskConical /> Science
        </Link>
        <Link
          href="/autonomous-alt"
          className={buttonVariants({
            size: "sm",
            variant: activePath === "/autonomous-alt" ? "default" : "menu",
          })}
        >
          <Navigation /> Autonomous (V2)
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {rtk && (
          <div className="flex items-center bg-white/20 p-2">
            <Circle className="fill-green-500 stroke-green-500" size={18} />
            <p className="text-xs ml-2 font-bold">RTK Enabled</p>
          </div>
        )}
        <p className="text-xs mr-2">
          ROS{" "}
          {isConnected ? (
            <span className="bg-green-500 text-green-800 p-1">Connected</span>
          ) : (
            <span className="bg-red-300 p-1 text-red-800">Disconnected</span>
          )}
        </p>
        {!isConnected && (
          <Button
            onClick={connectRos}
            className="bg-white/10 hover:bg-white/30 dark:text-white"
            disabled={connectingRos}
            size="sm"
          >
            {connectingRos && <Loader2 className="animate-spin" size={10} />}
            Connect
          </Button>
        )}
        {/* <Dialog>
          <DialogTrigger className={buttonVariants({ size: "sm" })}>
            <Keyboard />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
};

export default TopBar;
