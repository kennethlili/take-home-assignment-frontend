import { useState } from "react";
import { skipToken, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ZONING_TYPE } from "@/constants/enums";
import { useUpsertZoningTypes } from "@/generated-api/apiComponents";
import { queryKeyFn } from "@/generated-api/apiContext";
import { useApiErrorToast } from "@/hooks/useApiErrorToast";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { LoadingButton } from "./ui/LoadingButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { ZoningEnumType } from "@/constants/enums";
import type { Property } from "@/generated-api/apiSchemas";
import type { InvalidateQueryFilters } from "@tanstack/react-query";

export const UpdateZoningTypeDialog = ({
  isOpen,
  onClose,
  selectedProperties,
  selectedProperty,
  setSelectedProperty,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedProperties: { id: number }[];
  selectedProperty: Property | null;
  setSelectedProperty: React.Dispatch<React.SetStateAction<Property | null>>;
}) => {
  const [selectedZoningType, setSelectedZoningType] =
    useState<ZoningEnumType | null>(null);

  const queryClient = useQueryClient();

  function refetchProperties() {
    const queryKey = queryKeyFn({
      path: "/api/properties",
      operationId: "getPropertiesInBoundingBox",
      variables: skipToken,
    }) as InvalidateQueryFilters["queryKey"];
    queryClient.invalidateQueries({ queryKey: queryKey });
  }

  const { toastError } = useApiErrorToast({
    isError: false,
    title: "Error updating zoning type",
  });

  const { isPending: isLoading, mutate } = useUpsertZoningTypes({
    onSuccess: (responseData) => {
      // clear the cache for the properties in the bounding box
      refetchProperties();
      // update the selected property if it is in the response
      if (
        selectedProperty &&
        responseData.some(
          (property) => property.propertyRefId === selectedProperty?.id,
        )
      ) {
        setSelectedProperty((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            zoningType: selectedZoningType!,
          };
        });
      }

      toast.success("Zoning type updated successfully");
      onClose();
    },
    onError: (error) => {
      let message = "Unknown error";
      if (typeof error?.payload === "string") {
        message = error.payload;
      } else if (error?.payload) {
        message = error.payload.message || "Unknown error";
      }
      toastError({ description: message });
    },
  });

  const isValid = selectedZoningType !== null && selectedProperties.length > 0;
  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Please select a zoning type and at least one property.");
      return;
    }
    mutate({
      body: {
        propertyIds: selectedProperties.map((p) => p.id),
        zoningType: selectedZoningType,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Zoning Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to update the zoning type for the selected
            properties?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedProperties.length}{" "}
            {selectedProperties.length === 1 ? "property" : "properties"}{" "}
            selected
          </span>
          <Select
            onValueChange={(data: ZoningEnumType) =>
              setSelectedZoningType(data)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Zoning Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ZONING_TYPE).map(([_key, value]) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            disabled={!isValid}
            isLoading={isLoading}
          >
            Submit
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
