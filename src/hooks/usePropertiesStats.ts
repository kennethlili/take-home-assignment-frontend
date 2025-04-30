import { useMemo } from "react";
import * as turf from "@turf/turf"; // Add this import

import type { ZoningEnumType } from "@/constants/enums";
import type { Property } from "@/generated-api/apiSchemas";

export function usePropertiesStats({ properties }: { properties: Property[] }) {
  const stats: {
    totalCount: number;
    totalArea: number;
    zoningCounts: Record<ZoningEnumType, number>;
  } = useMemo(() => {
    if (!properties.length) {
      return {
        totalCount: 0,
        totalArea: 0,
        zoningCounts: {
          Residential: 0,
          Commercial: 0,
          Industrial: 0,
          Planned: 0,
        },
      };
    }

    // Calculate total area using Turf.js
    const totalArea = properties.reduce((sum, property) => {
      try {
        if (!property.geom?.coordinates) return sum;

        // Create a turf polygon from GeoJSON coordinates
        const polygonFeature = turf.polygon(property.geom.coordinates);

        // Calculate area in square meters
        const areaInSquareMeters = turf.area(polygonFeature);

        return sum + areaInSquareMeters;
      } catch (error) {
        console.error(
          "Error calculating area for property:",
          property.id,
          error,
        );
        return sum;
      }
    }, 0);

    // Count zoning types
    const zoningCounts: Record<ZoningEnumType, number> = {
      Residential: 0,
      Commercial: 0,
      Industrial: 0,
      Planned: 0,
    };

    properties.forEach((property) => {
      const zoningType = property.zoningType;
      zoningCounts[zoningType] = zoningCounts[zoningType] + 1;
    });

    return {
      totalCount: properties.length,
      totalArea,
      zoningCounts,
    };
  }, [properties]);

  return stats;
}
