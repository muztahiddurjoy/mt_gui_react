export interface Topic {
  name: string;
  messageType: string;
}

export const topics: Record<string, Topic> = {
  gps: {
    name: "/best_gps_acc",
    messageType: "sbg_driver/msg/SbgGpsPos",
  },
  yaw: {
    name: "/witmotion_eular/yaw",
    messageType: "/std_msgs/Float64",
  },
  roll: {
    name: "/witmotion_eular/yaw",
    messageType: "/std_msgs/Float64",
  },
  pitch: {
    name: "/witmotion_eular/yaw",
    messageType: "/std_msgs/Float64",
  },
};
