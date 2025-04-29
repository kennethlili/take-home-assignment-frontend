import { MAP_MAX_ZOOM, MAP_POLYGON_STYLE } from "@/constants/mapConfig";
import type { GetPropertiesInBoundingBoxResponse } from "@/generated-api/apiComponents";
import { useGetPropertiesInBoundingBox } from "@/generated-api/apiComponents";
import { useMapAttributes } from "@/hooks/useMapAttributes";
import { Marker, TileLayer, useMap } from "react-leaflet";
import type { GeoJSONProps } from "react-leaflet/GeoJSON";
import { GeoJSON } from "react-leaflet/GeoJSON";
import useSupercluster from "use-supercluster";
import { useMemo } from "react";
import { calculateCentroid } from "@/utils";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";

type PolygonFeature = Omit<
  GetPropertiesInBoundingBoxResponse[number],
  "geom"
> & {
  geom: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
};

interface ClusterPointFeature {
  id: string | number;
  type: "Feature";
  properties: Omit<PolygonFeature, "geom"> & {
    originalGeom: PolygonFeature["geom"];
    cluster: boolean;
    point_count: number;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

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
  const { zoom, bounds } = useMapAttributes();
  const { data } = useGetPropertiesInBoundingBox({
    queryParams: bounds,
  });

  const points = useMemo(() => {
    if (!data) return [];
    return data.map((property) => {
      const centroid = calculateCentroid(
        property.geom.coordinates as [number, number][][]
      );
      const { geom, ..._property } = property;
      return {
        type: "Feature",
        properties: {
          cluster: false,
          originalGeom: geom,
          ..._property,
        },
        geometry: {
          type: "Point",
          coordinates: [centroid[0], centroid[1]],
        },
      };
    });
  }, [data]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: [bounds.west, bounds.south, bounds.east, bounds.north],
    zoom,
    options: { radius: 30, maxZoom: MAP_MAX_ZOOM },
  });
  const map = useMap();

  function onClusterClick(
    clusterId: number | string,
    coordinates: LatLngExpression
  ) {
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(clusterId),
      MAP_MAX_ZOOM
    );

    map.setView(coordinates, expansionZoom, {
      animate: true,
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
                <GeoJSON
                  key={`property-${point.properties.id}`}
                  style={MAP_POLYGON_STYLE}
                  data={point.properties.originalGeom as GeoJSONProps["data"]}
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
            style={MAP_POLYGON_STYLE}
            data={cluster.properties.originalGeom as GeoJSONProps["data"]}
          />
        );
      })}
    </>
  );
};
