import { MAP_MAX_ZOOM, MAP_POLYGON_STYLE } from "@/constants/mapConfig";
import { useGetPropertiesInBoundingBox } from "@/generated-api/apiComponents";
import { useMapAttributes } from "@/hooks/useMapAttributes";
import { Marker, TileLayer } from "react-leaflet";
import type { GeoJSONProps } from "react-leaflet/GeoJSON";
import { GeoJSON } from "react-leaflet/GeoJSON";
import L from "leaflet";
import type { ClusterPointFeature } from "@/hooks/useMapClustering";
import { useMapClustering } from "@/hooks/useMapClustering";
import { useState } from "react";

const icons: Record<number, L.DivIcon> = {};
const fetchIcon = (count: number, size: number) => {
  if (!icons[count]) {
    icons[count] = L.divIcon({
      html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
        ${count}
      </div>`,
    });
  }
  return icons[count];
};

export const CustomMapContent = () => {
  const [selectedProperties, setSelectedProperties] = useState<
    { id: number }[]
  >([]);
  const { zoom, bounds } = useMapAttributes();
  const { data } = useGetPropertiesInBoundingBox({
    queryParams: bounds,
  });

  const { clusters, onClusterClick, supercluster, points } = useMapClustering({
    data,
    zoom,
    bounds,
  });

  function onPropertyClick(layer: L.Layer, id: number) {
    const isSelected = selectedProperties.some(
      (property) => property.id === id
    );

    if (isSelected) {
      // Deselect
      setSelectedProperties((prev) =>
        prev.filter((property) => property.id !== id)
      );
      (layer as L.Path).setStyle(MAP_POLYGON_STYLE.Default);
    } else {
      // Select
      setSelectedProperties((prev) => [...prev, { id }]);
      (layer as L.Path).setStyle(MAP_POLYGON_STYLE.Selected);
    }
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
              return (
                <GeoJSON
                  key={`property-${point.properties.id}`}
                  style={MAP_POLYGON_STYLE.Default}
                  data={point.properties.originalGeom as GeoJSONProps["data"]}
                  onEachFeature={(feature, layer) => {
                    layer.on("click", () => {
                      onPropertyClick(layer, cluster.properties.id);
                    });
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
                10 + (pointCount / points.length) * 40
              )}
              eventHandlers={{
                click: () => {
                  onClusterClick(cluster.id, [latitude, longitude]);
                },
              }}
            />
          );
        }

        return (
          <GeoJSON
            key={`property-${cluster.properties.id}`}
            style={MAP_POLYGON_STYLE.Default}
            data={cluster.properties.originalGeom as GeoJSONProps["data"]}
            onEachFeature={(feature, layer) => {
              layer.on("click", () => {
                onPropertyClick(layer, cluster.properties.id);
              });
            }}
          />
        );
      })}
    </>
  );
};
