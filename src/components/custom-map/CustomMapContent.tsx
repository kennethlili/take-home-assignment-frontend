import React, { useEffect } from "react";
import L from "leaflet";
import { Marker, TileLayer, useMap } from "react-leaflet";
import { MAP_MAX_ZOOM } from "@/constants/mapConfig";
import { useMapClustering } from "@/hooks/useMapClustering";
import { GeoJsonPolygon } from "./GeoJsonPolygon";
import type { GetPropertiesInBoundingBoxResponse } from "@/generated-api/apiComponents";
import type { Property } from "@/generated-api/apiSchemas";
import type { MapBounds } from "@/hooks/useMapAttributes";
import type { ClusterPointFeature } from "@/hooks/useMapClustering";
import type { GeoJSONProps } from "react-leaflet/GeoJSON";
import type { DebouncedState } from "use-debounce";

const icons: Record<number, L.DivIcon> = {};
const fetchIcon = (count: number, size: number) => {
  if (!icons[count]) {
    icons[count] = L.divIcon({
      html: `<div class="text-white bg-blue-600 rounded-full p-2.5 w-2.5 h-2.5 flex justify-center items-center" style="width: ${size}px; height: ${size}px;">
        ${count}
      </div>`,
    });
  }
  return icons[count];
};

interface CustomMapContentProps {
  data: GetPropertiesInBoundingBoxResponse | undefined;
  selectedProperties: { id: number }[];
  setSelectedProperties: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
      }[]
    >
  >;
  setSelectedProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  handleMapMove: DebouncedState<
    ({ bounds, zoom }: { bounds: MapBounds; zoom: number }) => void
  >;
  bounds: MapBounds;
  zoom: number;
  isLoading: boolean;
}

export const CustomMapContent = ({
  data,
  selectedProperties,
  setSelectedProperties,
  setSelectedProperty,
  handleMapMove,
  zoom,
  bounds,
  isLoading,
}: CustomMapContentProps) => {
  const map = useMap();

  useEffect(() => {
    function setMapAttributes() {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      handleMapMove({
        bounds: {
          west: bounds.getWest(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          north: bounds.getNorth(),
        },
        zoom,
      });
    }

    setMapAttributes();

    // Update attributes on move/zoom
    map.on("moveend", setMapAttributes);
    map.on("zoomend", setMapAttributes);

    return () => {
      map.off("moveend", setMapAttributes);
      map.off("zoomend", setMapAttributes);
    };
  }, [map]);

  const { clusters, onClusterClick, supercluster, points } = useMapClustering({
    data,
    zoom,
    bounds,
    isLoading,
  });

  function onPropertyClick(property: Property) {
    setSelectedProperty(property);
    setSelectedProperties((prev) => {
      const isSelected = prev.some((item) => item.id === property.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== property.id);
      } else {
        return [...prev, { id: property.id }];
      }
    });
  }

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {clusters.map((cluster: ClusterPointFeature) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        // we have a cluster to render
        if (isCluster) {
          // if we are at max zoom, we want to show the points inside the cluster
          if (zoom === MAP_MAX_ZOOM) {
            const clusterPts = supercluster.getChildren(cluster.id);
            return clusterPts.map((point: ClusterPointFeature) => {
              const property = point.properties.property;
              if (!property) {
                return <React.Fragment key={point.id} />;
              }

              return (
                <GeoJsonPolygon
                  key={`property-${property.id}`}
                  data={property.geom as GeoJSONProps["data"]}
                  isSelected={selectedProperties.some(
                    (property) => property.id === property.id,
                  )}
                  onClick={() => {
                    onPropertyClick(property);
                  }}
                />
              );
            });
          }

          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={fetchIcon(
                pointCount,
                10 + (pointCount / points.length) * 40,
              )}
              eventHandlers={{
                click: () => {
                  onClusterClick(cluster.id, [latitude, longitude]);
                },
              }}
            />
          );
        }

        const property = cluster.properties.property;
        if (!property) {
          return <React.Fragment key={cluster.id} />;
        }

        return (
          <GeoJsonPolygon
            key={`property-${property.id}`}
            data={property.geom as GeoJSONProps["data"]}
            isSelected={selectedProperties.some(
              (_property) => _property.id === property.id,
            )}
            onClick={() => {
              onPropertyClick(property);
            }}
          />
        );
      })}
    </>
  );
};
