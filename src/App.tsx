
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ProductList from "@/pages/ProductList";
import Admin from "@/pages/Admin";
import TestPurchase from "@/pages/TestPurchase";
import PLNToken from "@/pages/PLNToken";
import PulsaPurchase from "@/pages/PulsaPurchase";
import WhatsAppVerificationPage from "@/pages/WhatsAppVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-whatsapp" element={<WhatsAppVerificationPage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/test-purchase" element={<TestPurchase />} />
            <Route path="/pln-token" element={<PLNToken />} />
            <Route path="/pulsa" element={<PulsaPurchase />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
