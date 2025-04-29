import { AppSidebar } from "@/components/AppSidebar";
import { CustomMap } from "@/components/custom-map";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

const MapPage = () => {
  const [selectedProperties, setSelectedProperties] = useState<
    { id: number }[]
  >([]);
  return (
    <div className="h-screen w-screen">
      <SidebarProvider>
        <AppSidebar />
        <CustomMap
          selectedProperties={selectedProperties}
          setSelectedProperties={setSelectedProperties}
        />
      </SidebarProvider>
    </div>
  );
};
export default MapPage;
