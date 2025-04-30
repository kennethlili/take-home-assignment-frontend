import { Button } from "./button";
import { LoadingSpinner } from "./LoadingSpinner";
import type { ButtonProps } from "./button";

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  loadingText?: string;
}

export const LoadingButton = ({
  children,
  isLoading,
  loadingText,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          {loadingText || "Loading..."}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
