import { ModeToggle } from "./ModeToggle";
import { SIDEBAR_WIDTH, SidebarTrigger, useSidebar } from "./ui/sidebar";

export function AppHeader() {
  const { isMobile, state } = useSidebar();

  return (
    <div
      className="flex h-min items-center justify-between p-2"
      style={{
        width: isMobile
          ? "100%"
          : state === "expanded"
            ? `calc(100% - ${SIDEBAR_WIDTH})`
            : "100%",
      }}
    >
      <div className="flex h-min items-center gap-2">
        <SidebarTrigger />
        <img src="/logo.png" alt="Spatial Laser Logo" className="h-6 w-6" />
        <h4>Spatial Laser</h4>
      </div>
      <ModeToggle />
    </div>
  );
}
