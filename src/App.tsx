import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import "leaflet/dist/leaflet.css";
import MapPage from "./pages/MapPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MapPage />
    </QueryClientProvider>
  );
}

export default App;
