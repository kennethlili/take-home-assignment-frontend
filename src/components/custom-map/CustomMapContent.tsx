import L from "leaflet";
import { Marker, TileLayer } from "react-leaflet";
import { MAP_MAX_ZOOM } from "@/constants/mapConfig";
import { useGetPropertiesInBoundingBox } from "@/generated-api/apiComponents";
import { useMapAttributes } from "@/hooks/useMapAttributes";
import { useMapClustering } from "@/hooks/useMapClustering";
import { GeoJsonPolygon } from "./GeoJsonPolygon";
import type { Property } from "@/generated-api/apiSchemas";
import type { ClusterPointFeature } from "@/hooks/useMapClustering";
import type { GeoJSONProps } from "react-leaflet/GeoJSON";

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
  setSelectedProperty,
}: {
  selectedProperties: { id: number }[];
  setSelectedProperties: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
      }[]
    >
  >;
  setSelectedProperty: React.Dispatch<React.SetStateAction<Property | null>>;
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

  function onPropertyClick(layer: L.Layer, property: Property) {
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
              return (
                <GeoJsonPolygon
                  key={`property-${point.properties.property.id}`}
                  data={point.properties.property.geom as GeoJSONProps["data"]}
                  isSelected={selectedProperties.some(
                    (property) => property.id === point.properties.property.id,
                  )}
                  onEachFeature={(feature, layer) => {
                    layer.on("click", () => {
                      onPropertyClick(layer, point.properties.property);
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
            key={`property-${cluster.properties.property.id}`}
            data={cluster.properties.property.geom as GeoJSONProps["data"]}
            isSelected={selectedProperties.some(
              (property) => property.id === cluster.properties.property.id,
            )}
            onEachFeature={(feature, layer) => {
              layer.on("click", () => {
                onPropertyClick(layer, cluster.properties.property);
              });
            }}
          />
        );
      })}
    </>
  );
};
