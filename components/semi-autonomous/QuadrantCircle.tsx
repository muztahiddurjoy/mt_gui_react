import { useEffect } from "react";
import * as L from "leaflet";

export function QuadrantCircle({ map, center, radius }) {
  useEffect(() => {
    if (!map) return;

    // Create four quadrant paths
    const quadrants = [
      { color: "red", startAngle: 0, endAngle: 90 }, // NE
      { color: "blue", startAngle: 90, endAngle: 180 }, // NW
      { color: "green", startAngle: 180, endAngle: 270 }, // SW
      { color: "yellow", startAngle: 270, endAngle: 360 }, // SE
    ];

    const quadrantLayers = quadrants.map((q) => {
      const path = L.path();

      // Custom function to draw a circle sector
      path.setStyle({
        color: q.color,
        fillColor: q.color,
        fillOpacity: 0.5,
        weight: 1,
      });

      // Update the path when view changes
      path.onAdd = function () {
        this._update();
      };

      path._update = function () {
        const latLng = L.latLng(center[0], center[1]);
        const point = map.latLngToLayerPoint(latLng);
        const r =
          radius / map.getZoomScale(map.getZoom(), map.options.crs.scale(0));

        let pathData = `M ${point.x} ${point.y} `;
        pathData += `L ${point.x + r * Math.cos((q.startAngle * Math.PI) / 180)} ${point.y - r * Math.sin((q.startAngle * Math.PI) / 180)} `;
        pathData += `A ${r} ${r} 0 0 1 ${point.x + r * Math.cos((q.endAngle * Math.PI) / 180)} ${point.y - r * Math.sin((q.endAngle * Math.PI) / 180)} `;
        pathData += "Z";

        this._path.setAttribute("d", pathData);
      };

      path.addTo(map);
      return path;
    });

    return () => {
      quadrantLayers.forEach((layer) => map.removeLayer(layer));
    };
  }, [map, center, radius]);

  return null;
}
