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
import TopupSaldo from "@/pages/TopupSaldo";
import TopupHistory from "@/pages/TopupHistory";
import TopupDetail from "@/pages/TopupDetail";
import Transfer from "@/pages/Transfer";
import DataPackagePurchase from "@/pages/DataPackagePurchase";
import TransactionDetail from "@/pages/TransactionDetail";
import EWalletTransaksi from "./pages/EWalletTransaksi";
import History from "./pages/History";
import PDAM from "./pages/PDAM";
import Delivery from "./pages/Delivery";
import Wallet from "./pages/Wallet";
import Gaming from "./pages/Gaming";
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
            <Route path="/topup-saldo" element={<TopupSaldo />} />
            <Route path="/topup-history" element={<TopupHistory />} />
            <Route path="/topup-detail/:id" element={<TopupDetail />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/data-packages" element={<DataPackagePurchase />} />
            <Route path="/transaction-detail/:id" element={<TransactionDetail />} />
            <Route path="/ewallet-transaksi" element={<EWalletTransaksi />} />
            <Route path="/history" element={<History />} />
            <Route path="/pdam" element={<PDAM />} />
            <Route path="/services" element={<Delivery />} />
            <Route path="/wallet" element={<TopupSaldo />} />
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/insurance/bpjs-kesehatan" element={<BPJSKesehatan />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
