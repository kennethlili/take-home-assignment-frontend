import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { SelectedProperties } from "./SelectedProperties";
import { SelectedPropertyInfo } from "./SelectedPropertyInfo";
import { SelectedPropertyStats } from "./SelectedPropertyStats";
import type { GetPropertiesInBoundingBoxResponse } from "@/generated-api/apiComponents";
import type { Property } from "@/generated-api/apiSchemas";

interface AppSidebarProps {
  data: GetPropertiesInBoundingBoxResponse | undefined;
  selectedProperties: { id: number }[];
  onClearSelection: () => void;
  onDeselectProperty: (propertyId: number) => void;
  onClickUpdateZoningType: () => void;
  selectedProperty: Property | null;
}

export function AppSidebar({
  selectedProperties,
  onClearSelection,
  onDeselectProperty,
  onClickUpdateZoningType,
  selectedProperty,
  data,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SelectedPropertyStats
          selectedProperties={selectedProperties}
          data={data}
        />
        <Separator />
        <SelectedPropertyInfo currentProperty={selectedProperty} />
        <Separator />
        <SelectedProperties
          selectedProperties={selectedProperties}
          onClearSelection={onClearSelection}
          onDeselectProperty={onDeselectProperty}
          onClickUpdateZoningType={onClickUpdateZoningType}
        />
      </SidebarContent>
    </Sidebar>
  );
}
