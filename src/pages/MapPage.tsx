import { useState } from "react";
import { CustomMap } from "@/components/custom-map";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UpdateZoningTypeDialog } from "@/components/UpdateZoningTypeDialog";
import type { Property } from "@/generated-api/apiSchemas";

const MapPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<
    { id: number }[]
  >([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  function onClearSelection() {
    setSelectedProperties([]);
  }
  function onDeselectProperty(propertyId: number) {
    setSelectedProperties((prev) =>
      prev.filter((property) => property.id !== propertyId),
    );
  }

  return (
    <>
      <div className="h-screen w-screen">
        <SidebarProvider>
          <AppSidebar
            onClickUpdateZoningType={() => {
              setIsOpen(true);
            }}
            onClearSelection={onClearSelection}
            selectedProperties={selectedProperties}
            onDeselectProperty={onDeselectProperty}
            selectedProperty={selectedProperty}
          />
          <CustomMap
            selectedProperties={selectedProperties}
            setSelectedProperties={setSelectedProperties}
            setSelectedProperty={setSelectedProperty}
          />
        </SidebarProvider>
      </div>
      <UpdateZoningTypeDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        selectedProperties={selectedProperties}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
      />
    </>
  );
};
export default MapPage;
