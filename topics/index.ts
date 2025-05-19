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
    name: "/witmotion_eular/roll",
    messageType: "/std_msgs/Float64",
  },
  pitch: {
    name: "/witmotion_eular/pitch",
    messageType: "/std_msgs/Float64",
  },
  science: {
    name: "/sensors",
    messageType: "std_msgs/String",
  },
  autonomous_light: {
    name: "/light_status",
    messageType: "std_msgs/msg/String",
  },
};



// temperature (celcius)
// mosture (%)
// pH (0-14)
// conductivity (  )
