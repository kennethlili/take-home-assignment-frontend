import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import { Toaster } from "./components/ui/sonner";
import MapPage from "./pages/MapPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <MapPage />
    </QueryClientProvider>
  );
}

export default App;
