import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";
import type { Property } from "@/generated-api/apiSchemas";

export const SelectedPropertyInfo = ({
  currentProperty,
}: {
  currentProperty: Property | null;
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Property Information</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="space-y-4 p-4">
          {!currentProperty ? (
            <p>No Property Selected</p>
          ) : (
            <>
              <InfoItem label="ID" value={currentProperty.id.toString()} />
              <InfoItem label="Name" value={currentProperty.name} />
              <InfoItem
                label="Parcel Number"
                value={currentProperty.parcelNumber}
              />
              <InfoItem label="Zoning Sub" value={currentProperty.zoningSub} />
              <InfoItem
                label="Zoning Type"
                value={currentProperty.zoningType}
              />
            </>
          )}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => {
  if (!value) return null;

  return (
    <div className="border-b pb-2 last:border-0 last:pb-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={"text-sm font-medium"}>{value}</p>
    </div>
  );
};
