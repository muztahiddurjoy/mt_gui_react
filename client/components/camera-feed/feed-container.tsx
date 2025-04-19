import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button";
export interface FeedContainerProps {
  url:string
}
const FeedContainer = (props:FeedContainerProps) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [angle, setangle] = useState<number>(0);
  const [hflip, sethflip] = useState<boolean>(false);
  const [vflip, setvflip] = useState<boolean>(false);
  const statusColors = {
    connecting: 'bg-yellow-500',
    connected: 'bg-green-500',
    error: 'bg-red-500'
  };

  const validateFeed = () => {
    axios.get(props.url,{
      timeout: 5000
    })
      .then((res) => {
        setStatus('connected');
        console.log(res.data) 
      }
      )
      .catch(() => {
        setStatus('error');
      }
      );
  }

  useEffect(() => {
    validateFeed()
  }, [props.url])
  

  

 

  return (
    <div className={`bg-primary/20 rounded-md p-1 mt-5 relative overflow-hidden ${angle==270||angle==90?"h-[350px]":"h-[250px]"}`}>
    
    
      <div className="flex h-[27px] gap-2">
      <div className="p-1.5 bg-primary/30 rounded-md flex items-center">
      <div className={`w-[10px] h-[10px] ${statusColors[status]} rounded-full`}></div>
        <p className="text-xs ml-1 -mt-1">{status}</p>
      </div>
      <Select onValueChange={e=> setangle(Number(e))} defaultValue="0">
        <SelectTrigger className="w-[80px] h-[27px] bg-primary/30">
        <SelectValue placeholder="0°" />
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="0">0°</SelectItem>
        <SelectItem value="90">90°</SelectItem>
        <SelectItem value="180">180°</SelectItem>
          <SelectItem value="270">270°</SelectItem>
          <SelectItem value="360">360°</SelectItem>
        </SelectContent>
      </Select>
      <Button 
      variant={!hflip?"ghost":"default"}
        size="sm"
        className="h-[27px]"
        onClick={() => sethflip(prev => !prev)}
      >
        HFlip
      </Button>
      <Button 
      variant={!vflip?"ghost":"default"}
        size="sm"
        className="h-[27px]"
        onClick={() => setvflip(prev => !prev)}
      >
        VFlip
      </Button>
      </div>

      {status=="connecting"?
      <div className="w-full h-[210px] flex items-center flex-col justify-center rounded-md bg-white/10 mt-1">
        <Loader2 className="animate-spin" size={30}/>
        <p className="text-sm mt-2">Loading...</p>
      </div>:
      status=="error"?
      <div className="w-full h-[210px] flex items-center flex-col justify-center rounded-md bg-white/10 mt-1">
        <p className="text-sm mt-2">Error loading feed</p>
      </div>:
      <iframe
      style={{
        transform: `rotate(${angle}deg) scale(${hflip ? -1 : 1}, ${vflip ? -1 : 1})`
      }}
      src={props.url}
      className={`w-full h-[210px] rounded-md ${angle==90||angle==270?"mt-[60px]":"mt-1"} `}
      />}
    </div>
  );
};

export default FeedContainer;