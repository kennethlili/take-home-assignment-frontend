import { useGetPropertiesInBoundingBox } from "@/generated-api/apiComponents";
import { useMapBounds } from "@/hooks/useMapBounds";
import { TileLayer } from "react-leaflet";
import type { GeoJSONProps } from "react-leaflet/GeoJSON";
import { GeoJSON } from "react-leaflet/GeoJSON";

export const CustomMapContent = () => {
  const bounds = useMapBounds();
  const { data } = useGetPropertiesInBoundingBox({
    queryParams: bounds,
  });

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data?.map((property) => {
        return (
          <GeoJSON
            style={{ color: "red" }}
            data={property.geom as GeoJSONProps["data"]}
          />
        );
      })}
    </>
  );
};
