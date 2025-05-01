import { useEffect } from "react";
import { toast } from "sonner";

export function useApiErrorToast({
  isError,
  title,
  description,
}: {
  isError: boolean;
  title: string;
  description?: string;
}) {
  useEffect(() => {
    if (isError) {
      toastError({
        description,
      });
    }
  }, [isError]);

  function toastError({ description }: { description?: string }) {
    let message = title;
    if (description) {
      message += ` - ${description}`;
    }
    toast.error(message);
  }

  return { toastError };
}
