import { AppSidebar } from "@/components/AppSidebar";
import { CustomMap } from "@/components/custom-map";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

const MapPage = () => {
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
    <div className="h-screen w-screen">
      <SidebarProvider>
        <AppSidebar
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
  );
};
export default MapPage;
