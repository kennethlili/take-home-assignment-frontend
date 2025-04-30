import { ModeToggle } from "./ModeToggle";
import { SidebarTrigger } from "./ui/sidebar";

export function AppHeader() {
  return (
    <div className="flex h-min w-full items-center justify-between p-2">
      <div className="flex h-min items-center gap-2">
        <SidebarTrigger />
        <img src="/logo.png" alt="Spatial Laser Logo" className="h-6 w-6" />
        <h4>Spatial Laser</h4>
      </div>
      <ModeToggle />
    </div>
  );
}
