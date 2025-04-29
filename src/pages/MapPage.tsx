import { CustomMap } from "@/components/custom-map";
import { useState } from "react";

const MapPage = () => {
  const [selectedProperties, setSelectedProperties] = useState<
    { id: number }[]
  >([]);
  return (
    <div className="h-screen w-screen">
      <div className="h-max bg-accent">test</div>
      <CustomMap
        selectedProperties={selectedProperties}
        setSelectedProperties={setSelectedProperties}
      />
    </div>
  );
};
export default MapPage;
