declare module "leaflet.offline" {
  import { Layer, TileLayer } from "leaflet";

  export function createTileLayer(urlTemplate: string, options: any): TileLayer;
  export function tileLayerOffline(
    urlTemplate: string,
    options: any,
  ): TileLayer;
  export function offlineTileLayer(
    urlTemplate: string,
    options: any,
  ): TileLayer;
  export function saveTile(tile: any, key: string): Promise<void>;
  export function getStorageLength(): Promise<number>;
  export function getAllKeys(): Promise<string[]>;
  export function getTileUrl(key: string): Promise<string>;
  export function removeTile(key: string): Promise<void>;
  export function truncate(): Promise<void>;
}
