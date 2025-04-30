import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { SelectedProperties } from "./SelectedProperties";
import { SelectedPropertyInfo } from "./SelectedPropertyInfo";
import type { Property } from "@/generated-api/apiSchemas";

export function AppSidebar({
  selectedProperties,
  onClearSelection,
  onDeselectProperty,
  onClickUpdateZoningType,
  selectedProperty,
}: {
  selectedProperties: { id: number }[];
  onClearSelection: () => void;
  onDeselectProperty: (propertyId: number) => void;
  onClickUpdateZoningType: () => void;
  selectedProperty: Property | null;
}) {
  return (
    <Sidebar>
      <SidebarContent>
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
