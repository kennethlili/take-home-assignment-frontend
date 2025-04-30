import { useMemo } from "react";
import { usePropertiesStats } from "@/hooks/usePropertiesStats";
import { formatArea } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";
import type { GetPropertiesInBoundingBoxResponse } from "@/generated-api/apiComponents";

interface PropertyStatsProps {
  selectedProperties: { id: number }[];
  data: GetPropertiesInBoundingBoxResponse | undefined;
}

export function SelectedPropertyStats({
  selectedProperties,
  data,
}: PropertyStatsProps) {
  // Filter properties from data that match selected property IDs
  const filteredProperties = useMemo(() => {
    if (!data || !selectedProperties.length) return [];

    const selectedIds = new Set(selectedProperties.map((p) => p.id));
    return data.filter((property) => selectedIds.has(property.id));
  }, [data, selectedProperties]);

  const stats = usePropertiesStats({
    properties: filteredProperties,
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Selected Properties Statistics</SidebarGroupLabel>
      <SidebarGroupContent className="text-sm">
        <div className="space-y-4 p-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Parcels:</span>
            <span className="font-medium">{stats.totalCount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Area:</span>
            <span className="font-medium">{formatArea(stats.totalArea)}</span>
          </div>

          <div className="text-muted-foreground font-medium mt-2 border-t pt-2">
            Zoning Types:
          </div>
          {Object.entries(stats.zoningCounts).map(([zoningType, count]) => (
            <div key={zoningType} className="flex justify-between pl-2">
              <span className="text-muted-foreground">{zoningType}:</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
