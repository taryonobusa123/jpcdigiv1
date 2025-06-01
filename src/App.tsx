
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Wallet from "./pages/Wallet";
import History from "./pages/History";
import Profile from "./pages/Profile";
import PayBills from "./pages/PayBills";
import TopUp from "./pages/TopUp";
import Transfer from "./pages/Transfer";
import EWallet from "./pages/EWallet";
import Gaming from "./pages/Gaming";
import Insurance from "./pages/Insurance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pay-bills" element={<PayBills />} />
          <Route path="/topup" element={<TopUp />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/ewallet" element={<EWallet />} />
          <Route path="/gaming" element={<Gaming />} />
          <Route path="/insurance" element={<Insurance />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
