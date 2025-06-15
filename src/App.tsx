
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import ProductList from '@/pages/ProductList';
import Admin from '@/pages/Admin';
import TestPurchase from '@/pages/TestPurchase';
import PLNToken from '@/pages/PLNToken';
import PulsaPurchase from '@/pages/PulsaPurchase';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/test-purchase" element={<TestPurchase />} />
            <Route path="/pln-token" element={<PLNToken />} />
            <Route path="/pulsa" element={<PulsaPurchase />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
