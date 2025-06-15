
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PaymentMethods from "./pages/PaymentMethods";
import Notifications from "./pages/Notifications";
import Security from "./pages/Security";
import Rewards from "./pages/Rewards";
import HelpCenter from "./pages/HelpCenter";
import About from "./pages/About";
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/security" element={<Security />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/about" element={<About />} />
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
