"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

interface CameraTopbarProps {
  grid: number;
  setgrid: React.Dispatch<React.SetStateAction<number>>;
  urls?: string[];
  seturls?: React.Dispatch<React.SetStateAction<string[]>>;
}

const CameraTopbar = (props: CameraTopbarProps) => {
  const [address, setaddress] = useState<string>("");

  const addAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address) return;
    if (props.seturls) {
      props.seturls((prev) => {
        // if(prev.includes(address)){
        //     return prev
        // }else{
        return [...prev, address];
        // }
      });
    }
    setaddress("");
  };

  return (
    <div className="bg-primary/20 p-2 flex items-center justify-between">
      <form className="flex items-center gap-2" onClick={addAddress}>
        <Input
          value={address}
          name="address"
          onChange={(e) => setaddress(e.target.value)}
          placeholder="Address"
          className="border-primary"
        />
        <Button disabled={!address} size="sm" type="submit">
          Add
        </Button>
      </form>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => props.setgrid((prev) => (prev != 0 ? prev - 1 : prev))}
        >
          <Minus />
        </Button>
        {props.grid}
        <Button size="sm" onClick={() => props.setgrid((prev) => prev + 1)}>
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default CameraTopbar;
