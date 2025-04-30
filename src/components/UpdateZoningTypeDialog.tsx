import { useState } from "react";
import { toast } from "sonner";
import { ZONING_TYPE } from "@/constants/enums";
import { useUpsertZoningTypes } from "@/generated-api/apiComponents";
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
import type { ZoningType } from "@/constants/enums";

export const UpdateZoningTypeDialog = ({
  isOpen,
  onClose,
  selectedProperties,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedProperties: { id: number }[];
}) => {
  const [selectedZoningType, setSelectedZoningType] =
    useState<ZoningType | null>(null);
  const mutation = useUpsertZoningTypes({});

  const isValid = selectedZoningType !== null && selectedProperties.length > 0;
  const isLoading = mutation.isPending;
  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Please select a zoning type and at least one property.");
      return;
    }
    mutation.mutate(
      {
        body: {
          propertyIds: selectedProperties.map((p) => p.id),
          zoningType: selectedZoningType,
        },
      },
      {
        onSuccess: () => {
          toast.success("Zoning type updated successfully");
          onClose();
        },
      },
    );
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
            onValueChange={(data: ZoningType) => setSelectedZoningType(data)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Zoning Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ZONING_TYPE).map(([key, value]) => (
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
