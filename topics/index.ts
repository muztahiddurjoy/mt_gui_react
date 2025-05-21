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
  autonomous_light: {
    name: "/light_status",
    messageType: "std_msgs/msg/String",
  },
  //Alt Autonomous
  alt_gps: {
    name: "/alt_best_gps_acc",
    messageType: "sbg_driver/msg/SbgGpsPos",
  },
  alt_yaw: {
    name: "/alt_witmotion_eular/yaw",
    messageType: "/std_msgs/Float64",
  },
  alt_roll: {
    name: "/alt_witmotion_eular/roll",
    messageType: "/std_msgs/Float64",
  },
  alt_pitch: {
    name: "/alt_witmotion_eular/pitch",
    messageType: "/std_msgs/Float64",
  },
  alt_autonomous_light: {
    name: "/alt_light_status",
    messageType: "std_msgs/msg/String",
  },
  // Science Topics
  humidity: {
    name: "/humidity",
    messageType: "std_msgs/Float64",
  },
  light: {
    name: "/light",
    messageType: "std_msgs/Float64",
  },
  temperature: {
    name: "/temperature",
    messageType: "std_msgs/Float64",
  },
  oxygen: {
    name: "/oxygen",
    messageType: "std_msgs/Float64",
  },
  pressure: {
    name: "/pressure",
    messageType: "std_msgs/Float64",
  },
  altitude: {
    name: "/altitude",
    messageType: "std_msgs/Float64",
  },
  uv: {
    name: "/uv",
    messageType: "std_msgs/Float64",
  },
  concentration: {
    name: "/concentration",
    messageType: "std_msgs/Float64",
  },
  co_monoxide: {
    name: "/co",
    messageType: "std_msgs/Float64",
  },
  soil_temperature: {
    name: "/soil_temperature",
    messageType: "std_msgs/Float64",
  },
  soil_ec: {
    name: "/soil_ec",
    messageType: "std_msgs/Float64",
  },
  soil_moisture: {
    name: "/soil_moisture",
    messageType: "std_msgs/Float64",
  },
  soil_ph:{
    name: "/soil_ph",
    messageType: "std_msgs/Float64",
  },
  soil_nitrogen: {
    name: "/soil_nitrogen",
    messageType: "std_msgs/Float64",
  },
  soil_phosphorus: {
    name: "/soil_phosphorus",
    messageType: "std_msgs/Float64",
  },
  soil_potassium: {
    name: "/soil_potassium",
    messageType: "std_msgs/Float64",
  },

  //Science Centrefuge
  centrefuge:{
    name: "/centrefuge",
    messageType: "std_msgs/Float64",
  }
  
};