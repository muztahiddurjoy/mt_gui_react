"use client"
import React, { useState } from 'react'
import { Coordinate } from '../MapContainer'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useEffect } from 'react';
import { toast } from 'sonner'
import { getROS } from '@/ros-functions/connect'
import ROSLIB, { Ros } from 'roslib'



const WaypointContainer = () => {
    const [start, setstart] = useState<Coordinate>({
        lat: 0,
        lng: 0
    })

    const [end, setend] = useState<Coordinate>({
        lat: 0,
        lng: 0
    })

    useEffect(() => {
      getROS().then((ros:Ros) => {
        const waypointTopic = new ROSLIB.Topic({
            ros: ros,
            name: '/semi_auto_wps',
            messageType: 'std_msgs/msg/Float32MultiArrays'
        });

        waypointTopic.subscribe((message) => {
            console.log('Received waypoints:', message);
        });
      }
      ).catch((error) => {
        console.error('Error connecting to ROS:', error);
        toast.error('Error connecting to ROS');
      })
    }, [])
    

    const sendWaypoints = () => {
      getROS().then((ros:Ros) => {
        var wpSend = new ROSLIB.Topic({
            ros : ros,
            name : '/semi_auto_wps',
            messageType : 'std_msgs/msg/Float32MultiArray'
          });
        
          var wps = new ROSLIB.Message({
            layout: {
                dim: [],
                data_offset: 0
            },
            data: [
                parseFloat(String(start.lat)).toFixed(6),
                parseFloat(String(start.lng)).toFixed(6),
                parseFloat(String(end.lat)).toFixed(6),
                parseFloat(String(end.lng)).toFixed(6)
            ]
          });
          wpSend.publish(wps);
          toast.success('Waypoints sent successfully');
      }).catch((error) => {
        console.error('Error connecting to ROS:', error);
        toast.error('Error connecting to ROS');
      })
    }
    

    useEffect(() => {
        if (isNaN(Number(start.lat)) || Number(start.lat) < -90 || Number(start.lat) > 90) {
            toast.error('Start latitude is invalid.');
        }
        if (isNaN(Number(start.lng)) || Number(start.lng) < -180 || Number(start.lng) > 180) {
            toast.error('Start longitude is invalid.');
        }
        if (isNaN(Number(end.lat)) || Number(end.lat) < -90 || Number(end.lat) > 90) {
            toast.error('End latitude is invalid.');
        }
        if (isNaN(Number(end.lng)) || Number(end.lng) < -180 || Number(end.lng) > 180) {
            toast.error('End longitude is invalid.');
        }
    }, [start, end]);
    
  return (
    <div className='fixed top-0 right-0 w-[15%] h-[100vh] pt-[50px] p-2'>
        <p className='text-sm'>Waypoints</p>
        <div className="mt-3">
            <div className="bg-primary/20 rounded-md p-3">
            <label className='text-xs'>Start</label>
            <br/>
            <label className='text-xs'>Lat</label>
            <Input placeholder='Latitude' type="text" value={start.lat} onChange={(e) => setstart({ ...start, lat: e.target.value })} />
            <label className='text-xs'>Lat</label>
            <Input placeholder='Longitude' type="text" value={start.lng} onChange={(e) => setstart({ ...start, lng: e.target.value })} />
            </div>

            <div className="bg-secondary/20 rounded-md p-3 mt-3">
            <label className='text-xs'>End</label>
            <br/>
            <label className='text-xs'>Lat</label>
            <Input placeholder='Latitude' type="text" value={end.lat} onChange={(e) => setend({ ...end, lat:e.target.value })} />
            <label className='text-xs'>Lng</label>
            <Input placeholder='Longitude' type="text" value={end.lng} onChange={(e) => setend({ ...end, lng:e.target.value })} />
            </div>
            <div className="flex mt-5 justify-center">
                <Button disabled={
                    start.lat==0 || start.lng==0 || end.lat==0 || end.lng==0
                }
                onClick={sendWaypoints}
                >Execute</Button>
            </div>
            
        </div>
    </div>
  )
}

export default WaypointContainer