import { X } from "lucide-react";
import { Button } from "../ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";

export const SelectedProperties = ({
  selectedProperties,
  onClearSelection,
  onDeselectProperty,
  onClickUpdateZoningType,
}: {
  selectedProperties: { id: number }[];
  onClearSelection: () => void;
  onDeselectProperty: (propertyId: number) => void;
  onClickUpdateZoningType: () => void;
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Selected Properties</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="space-y-4 p-4">
          {/* Display count of selected properties */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedProperties.length}{" "}
              {selectedProperties.length === 1 ? "property" : "properties"}{" "}
              selected
            </span>

            {/* Clear selection button */}
            {selectedProperties.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="flex items-center gap-1"
              >
                <X size={14} />
                <span>Clear</span>
              </Button>
            )}
          </div>

          {/* List of selected properties could go here */}
          {selectedProperties.length > 0 && (
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
              {selectedProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between border-b py-1 text-xs last:border-0"
                >
                  Property #{property.id}
                  <Button
                    variant={"ghost"}
                    onClick={() => onDeselectProperty(property.id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={onClickUpdateZoningType}
            disabled={selectedProperties.length === 0}
            className="flex w-full gap-2"
          >
            Update Zoning Type
          </Button>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
