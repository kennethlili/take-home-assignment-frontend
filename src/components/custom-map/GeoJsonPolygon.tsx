import { MAP_POLYGON_STYLE } from "@/constants/mapConfig";
import type { GeoJSONProps } from "react-leaflet";
import { GeoJSON } from "react-leaflet/GeoJSON";

export const GeoJsonPolygon = ({
  data,
  isSelected,
  onEachFeature,
}: {
  data: GeoJSONProps["data"];
  isSelected: boolean;
  onEachFeature: GeoJSONProps["onEachFeature"];
}) => {
  return (
    <GeoJSON
      style={
        isSelected ? MAP_POLYGON_STYLE.Selected : MAP_POLYGON_STYLE.Default
      }
      data={data}
      onEachFeature={onEachFeature}
    />
  );
};
