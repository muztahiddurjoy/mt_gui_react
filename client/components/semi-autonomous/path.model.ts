export interface Path {
    header: Header
    poses: Pose[]
  }
  
  export interface Header {
    stamp: Stamp
    frame_id: string
  }
  
  export interface Stamp {
    sec: number
    nanosec: number
  }
  
  export interface Pose {
    header: Header2
    pose: Pose2
  }
  
  export interface Header2 {
    stamp: Stamp2
    frame_id: string
  }
  
  export interface Stamp2 {
    sec: number
    nanosec: number
  }
  
  export interface Pose2 {
    position: Position
    orientation: Orientation
  }
  
  export interface Position {
    x: number
    y: number
    z: number
  }
  
  export interface Orientation {
    x: number
    y: number
    z: number
    w: number
  }
  