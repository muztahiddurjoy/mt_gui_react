Here's the refined documentation with MapProxy details and without the additional tools section:

# Mongoltori Hypersonic (MT10) - ROS 2 GUI

![ROS 2 Humble](https://img.shields.io/badge/ROS-2_Humble-blue)
![Next.js](https://img.shields.io/badge/Next.js-13-blue)

Next.js-based GUI for MT10 Hypersonic vehicle with ROS 2 Humble integration.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Python 3.x
- ROS 2 Humble
- MapProxy (installed via pip)

```bash
git clone https://github.com/muztahiddurjoy/mt_gui_react
cd mt_gui_react/client
npm install
```

## 🔧 ROS 2 Setup

1. Install required packages:
```bash
sudo apt install ros-humble-rosbridge-suite ros-humble-rosbridge-server
```

2. Run rosbridge:
```bash
source /opt/ros/humble/setup.bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

## 🗺️ MapProxy Configuration

The MapProxy configuration is located in `/mapproxy/mapproxy.yaml`. To set up:

1. Install MapProxy:
```bash
pip install mapproxy
```

2. Run MapProxy (from project root):
```bash
cd mapproxy
mapproxy-util serve-develop ./mapproxy.yaml
```

## 🖥️ Running the GUI

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start development server             |
| `npm run build`  | Create production build              |
| `npm start`      | Run production server                |
| `npm run map`    | Start MapProxy server                |

## 🌐 ROS 2 Configuration

### Topic Configuration
Modify `/client/topics/index.ts` to update ROS 2 topics:
```typescript
export interface Topic {
  name: string;
  messageType: string;
}

export const topics: Record<string, Topic> = {
  gps: {
    name: "/best_gps_acc",                  // Update topic name
    messageType: "sbg_driver/msg/SbgGpsPos" // Update message type
  },
  yaw: {
    name: "/witmotion_eular/yaw",
    messageType: "/std_msgs/Float64"
  },
};
```

## 🛠️ Troubleshooting

### Common Issues
- **Connection failures**: Verify rosbridge is running (`ros2 topic list`)
- **Topic errors**: Check topic names/types in `/client/topics/index.ts`
- **Map issues**: Ensure MapProxy is running (`npm run map`)
- **Dependency problems**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
