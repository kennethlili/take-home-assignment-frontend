import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { CustomMap } from "@/components/custom-map";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UpdateZoningTypeDialog } from "@/components/UpdateZoningTypeDialog";

const MapPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<
    { id: number }[]
  >([]);
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
          />
          <CustomMap
            selectedProperties={selectedProperties}
            setSelectedProperties={setSelectedProperties}
          />
        </SidebarProvider>
      </div>
      <UpdateZoningTypeDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        selectedProperties={selectedProperties}
      />
    </>
  );
};
export default MapPage;
