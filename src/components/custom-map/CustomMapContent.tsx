import { MAP_MAX_ZOOM } from "@/constants/mapConfig";
import { useGetPropertiesInBoundingBox } from "@/generated-api/apiComponents";
import { useMapAttributes } from "@/hooks/useMapAttributes";
import { Marker, TileLayer } from "react-leaflet";
import type { GeoJSONProps } from "react-leaflet/GeoJSON";
import L from "leaflet";
import type { ClusterPointFeature } from "@/hooks/useMapClustering";
import { useMapClustering } from "@/hooks/useMapClustering";
import { GeoJsonPolygon } from "./GeoJsonPolygon";

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

export const CustomMapContent = ({
  selectedProperties,
  setSelectedProperties,
}: {
  selectedProperties: { id: number }[];
  setSelectedProperties: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
      }[]
    >
  >;
}) => {
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
    setSelectedProperties((prev) => {
      const isSelected = prev.some((property) => property.id === id);
      if (isSelected) {
        return prev.filter((property) => property.id !== id);
      } else {
        return [...prev, { id }];
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
              return (
                <GeoJsonPolygon
                  key={`property-${point.properties.id}`}
                  data={point.properties.originalGeom as GeoJSONProps["data"]}
                  isSelected={selectedProperties.some(
                    (property) => property.id === point.properties.id,
                  )}
                  onEachFeature={(feature, layer) => {
                    layer.on("click", () => {
                      onPropertyClick(layer, point.properties.id);
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

        return (
          <GeoJsonPolygon
            key={`property-${cluster.properties.id}`}
            data={cluster.properties.originalGeom as GeoJSONProps["data"]}
            isSelected={selectedProperties.some(
              (property) => property.id === cluster.properties.id,
            )}
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
