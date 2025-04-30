import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CustomMap } from "@/components/custom-map";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UpdateZoningTypeDialog } from "@/components/UpdateZoningTypeDialog";
import { useGetPropertiesInBoundingBox } from "@/generated-api/apiComponents";
import { useMapAttributes } from "@/hooks/useMapAttributes";
import type { Property } from "@/generated-api/apiSchemas";

const MapPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<
    { id: number }[]
  >([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const { bounds, handleMapMove, zoom } = useMapAttributes();

  const { data, isFetching } = useGetPropertiesInBoundingBox({
    queryParams: bounds,
  });
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
      <div className="h-svh max-w-svw">
        <SidebarProvider>
          <AppSidebar
            onClickUpdateZoningType={() => {
              setIsOpen(true);
            }}
            onClearSelection={onClearSelection}
            selectedProperties={selectedProperties}
            onDeselectProperty={onDeselectProperty}
            selectedProperty={selectedProperty}
            data={data}
          />
          <div className="flex h-svh w-full flex-col">
            <AppHeader />
            <CustomMap
              isLoading={isFetching}
              data={data}
              selectedProperties={selectedProperties}
              setSelectedProperties={setSelectedProperties}
              setSelectedProperty={setSelectedProperty}
              handleMapMove={handleMapMove}
              zoom={zoom}
              bounds={bounds}
            />
          </div>
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
