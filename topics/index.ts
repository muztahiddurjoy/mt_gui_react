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
  co: {
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
  },
  color_1: {
    name: "/color_1",
    messageType: "std_msgs/String",
  },
  color_2: {
    name: "/color_2",
    messageType: "std_msgs/String",
  },
  color_3: {
    name: "/color_3",
    messageType: "std_msgs/String",
  },
  color_4: {
    name: "/color_4",
    messageType: "std_msgs/String",
  },
  color_5: {
    name: "/color_5",
    messageType: "std_msgs/String",
  },
  color_6: {
    name: "/color_6",
    messageType: "std_msgs/String",
  },
  uv_1: {
    name: "/uv_1",
    messageType: "std_msgs/Float64",
  },
  uv_2: {
    name: "/uv_2",
    messageType: "std_msgs/Float64",
  },
  pump:{
    name: "/pump",
    messageType: "std_msgs/Bool",
  },
  heater:{
    name: "/heater",
    messageType: "std_msgs/Bool",
  }
  
};