import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import RoleSelector from "./pages/RoleSelector.tsx";
import FarmerPage from "./pages/FarmerPage.tsx";
import InsurerPage from "./pages/InsurerPage.tsx";
import NabardPage from "./pages/NabardPage.tsx";
import SupplierPage from "./pages/SupplierPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleSelector />} />
            <Route path="/farmer" element={<FarmerPage />} />
            <Route path="/insurer" element={<InsurerPage />} />
            <Route path="/nabard" element={<NabardPage />} />
            <Route path="/supplier" element={<SupplierPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
