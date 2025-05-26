import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from '../ui/button'
import { Coordinate } from './MapContainer';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';

export interface DeliveryMission {
    bound: number;
    setBound: React.Dispatch<React.SetStateAction<number>>;
    coord: Coordinate | null;
    setCoord: React.Dispatch<React.SetStateAction<Coordinate | null>>;
}

const DeliveryAddContainer = (props: DeliveryMission) => {
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    props.setCoord(prev => ({
      ...(prev || { lat: 0, lng: 0 }),
      lat: isNaN(value) ? 0 : value
    }));
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    props.setCoord(prev => ({
      ...(prev || { lat: 0, lng: 0 }),
      lng: isNaN(value) ? 0 : value
    }));
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="text-sm">Delivery Mission</CardTitle>
        <div className="space-y-2">
          <label className="text-xs" htmlFor="bound">Bound (m)</label>
          <Input
            id="bound"
            type="number"
            value={props.bound}
            onChange={(e) => props.setBound(parseInt(e.target.value) || 0)}
            placeholder="Enter bound"
            step="1"
          />
          <Slider 
            defaultValue={[0]} 
            max={200} 
            step={1} 
            value={[props.bound]} 
            onValueChange={(v) => props.setBound(v[0])} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs" htmlFor="latitude">Latitude</label>
          <Input
            id="latitude"
            type="number"
            value={props.coord?.lat || ''}
            onChange={handleLatitudeChange}
            placeholder="Enter latitude"
            step="0.000001"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs" htmlFor="longitude">Longitude</label>
          <Input
            id="longitude"
            type="number"
            value={props.coord?.lng || ''}
            onChange={handleLongitudeChange}
            placeholder="Enter longitude"
            step="0.000001"
          />
        </div>
        
       
      </CardHeader>
     
    </Card>
  )
}

export default DeliveryAddContainer