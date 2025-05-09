
export interface Topic{
    name:string
    messageType:string
}

export const topics:Record<string, Topic> = {
    gps:{
        name:'/sbg/gps_pos',
        messageType:'sbg_driver/msg/SbgGpsPos'
    },
    yaw:{
        name:'/witmotion_eular/yaw',
        messageType:'/std_msgs/Float64'
    },
}