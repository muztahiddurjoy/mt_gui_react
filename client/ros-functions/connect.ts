import ROSLIB, { Ros } from "roslib";

let ros: Ros | null = null;

export const connectROS = (): Promise<Ros> => {
  return new Promise((resolve, reject) => {
    let tempRos = new ROSLIB.Ros({
      url: "ws://localhost:9090", // Replace with your ROS bridge server URL
    });
    tempRos.on("connection", () => {
      console.log("Connected to ROS");
      ros = tempRos;
      resolve(ros);
    });
    tempRos.on("error", (error) => {
      console.log("Error connecting to ROS:", error);
      reject(error);
    });
  });
};

export const getROS = async (): Promise<Ros> => {
  if (ros === null) {
    return await connectROS();
  }
  return ros;
};
