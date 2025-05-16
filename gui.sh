#!/bin/bash

# Start ROSBridge WebSocket server
gnome-terminal -- ros2 launch rosbridge_server rosbridge_websocket_launch.xml

# Start MapProxy server
gnome-terminal -- bash -c "cd ~/muz/mt_gui_react/client/mapproxy && mapproxy-util serve-develop ./mapproxy.yaml"

# Start React development server
gnome-terminal -- bash -c "cd ~/muz/mt_gui_react/client && yarn dev"

echo "All services started in separate terminals"