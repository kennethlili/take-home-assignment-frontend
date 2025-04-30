import { GeoJSON } from "react-leaflet/GeoJSON";
import { MAP_POLYGON_STYLE } from "@/constants/mapConfig";
import type { GeoJSONProps } from "react-leaflet";

export const GeoJsonPolygon = ({
  data,
  isSelected,
  onClick,
}: {
  data: GeoJSONProps["data"];
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <GeoJSON
      style={
        isSelected ? MAP_POLYGON_STYLE.Selected : MAP_POLYGON_STYLE.Default
      }
      data={data}
      eventHandlers={{
        click: () => {
          onClick();
        },
      }}
    />
  );
};
