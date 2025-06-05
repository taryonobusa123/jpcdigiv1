
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
import ProductList from "./pages/ProductList";

// Bill Payment Pages
import PLNPascabayar from "./pages/PLNPascabayar";
import PLNPrabayar from "./pages/PLNPrabayar";
import PDAM from "./pages/PDAM";
import IndiHome from "./pages/IndiHome";

// Pulsa & Data Pages
import TelkomselPulsa from "./pages/TelkomselPulsa";

// E-Wallet Pages
import GoPay from "./pages/GoPay";

// Gaming Pages
import MobileLegends from "./pages/MobileLegends";

// Insurance Pages
import BPJSKesehatan from "./pages/BPJSKesehatan";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<ProductList />} />
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
            
            {/* Bill Payment Routes */}
            <Route path="/payment/electricity/pln-pascabayar" element={<PLNPascabayar />} />
            <Route path="/payment/electricity/pln-prabayar-(token)" element={<PLNPrabayar />} />
            <Route path="/payment/water/pdam-jakarta" element={<PDAM />} />
            <Route path="/payment/water/pdam-surabaya" element={<PDAM />} />
            <Route path="/service/indihome" element={<IndiHome />} />
            
            {/* Pulsa & Data Routes */}
            <Route path="/topup/telkomsel/pulsa" element={<TelkomselPulsa />} />
            <Route path="/topup/telkomsel/paket-data" element={<TelkomselPulsa />} />
            <Route path="/topup/telkomsel/paket-telepon-&-sms" element={<TelkomselPulsa />} />
            
            {/* E-Wallet Routes */}
            <Route path="/ewallet/gopay" element={<GoPay />} />
            <Route path="/ewallet/ovo" element={<GoPay />} />
            <Route path="/ewallet/dana" element={<GoPay />} />
            <Route path="/ewallet/linkaja" element={<GoPay />} />
            <Route path="/ewallet/shopeepay" element={<GoPay />} />
            
            {/* Gaming Routes */}
            <Route path="/gaming/mobile-legends" element={<MobileLegends />} />
            <Route path="/gaming/mobile-legends/diamond-ml" element={<MobileLegends />} />
            <Route path="/gaming/free-fire" element={<MobileLegends />} />
            <Route path="/gaming/pubg-mobile" element={<MobileLegends />} />
            <Route path="/gaming/steam-wallet" element={<MobileLegends />} />
            <Route path="/gaming/google-play" element={<MobileLegends />} />
            
            {/* Insurance Routes */}
            <Route path="/insurance/bpjs-kesehatan" element={<BPJSKesehatan />} />
            <Route path="/insurance/bpjs-ketenagakerjaan" element={<BPJSKesehatan />} />
            <Route path="/insurance/vehicle" element={<BPJSKesehatan />} />
            <Route path="/insurance/property" element={<BPJSKesehatan />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
