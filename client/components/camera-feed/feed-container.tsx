import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios'

export interface FeedContainerProps {
  url:string
}
const FeedContainer = (props:FeedContainerProps) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

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
    <div className="bg-primary/20 rounded-md p-1 mt-5 relative overflow-hidden h-[250px]">
      <div className="flex h-[27px]">
        <div className="p-1.5 bg-primary/30 rounded-md flex items-center">
        <div className={`w-[10px] h-[10px] ${statusColors[status]} rounded-full`}></div>
          <p className="text-xs ml-1 -mt-1">{status}</p>
        </div>
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
        src={props.url}
        className="w-full h-[210px] rounded-md mt-1 "
        />}
    </div>
  );
};

export default FeedContainer;