import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import SimpleMap from "./components/SimpleMap";
import "leaflet/dist/leaflet.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleMap />
    </QueryClientProvider>
  );
}

export default App;
