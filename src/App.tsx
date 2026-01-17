import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { BlueprintList } from "@/components/BlueprintList";
import { BlueprintCreator } from "@/components/BlueprintCreator";
import { BlueprintDetail } from "@/components/BlueprintDetail";
import { ContractList } from "@/components/ContractList";
import { ContractCreator } from "@/components/ContractCreator";
import { ContractDetail } from "@/components/ContractDetail";
import { useStore } from "@/store/useStore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const initializeDefaults = useStore((state) => state.initializeDefaults);

  useEffect(() => {
    initializeDefaults();
  }, [initializeDefaults]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/blueprints" element={<BlueprintList />} />
        <Route path="/blueprints/new" element={<BlueprintCreator />} />
        <Route path="/blueprints/:id" element={<BlueprintDetail />} />
        <Route path="/contracts" element={<ContractList />} />
        <Route path="/contracts/new" element={<ContractCreator />} />
        <Route path="/contracts/:id" element={<ContractDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
