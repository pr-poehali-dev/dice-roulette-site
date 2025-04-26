
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PaymentCallback from "./pages/PaymentCallback";
import Admin from "./pages/Admin"; // Добавляем импорт админ-страницы

const queryClient = new QueryClient();

const App = () => {
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('userBalance');
    return savedBalance ? parseFloat(savedBalance) : 0;
  });

  // Listen for balance update events
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent<{ newBalance: number }>) => {
      setBalance(event.detail.newBalance);
      
      // Update local storage
      localStorage.setItem('userBalance', event.detail.newBalance.toString());
    };

    window.addEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index initialBalance={balance} setGlobalBalance={setBalance} />} />
            <Route path="/payment-callback" element={<PaymentCallback />} />
            <Route path="/admin" element={<Admin />} /> {/* Добавляем маршрут к админ-панели */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
