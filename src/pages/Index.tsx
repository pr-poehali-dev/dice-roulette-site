
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CasinoHeader } from "@/components/CasinoHeader";
import { DiceGame } from "@/components/DiceGame";
import { PaymentModal } from "@/components/PaymentModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { PromoModal } from "@/components/PromoModal";
import { OfferModal } from "@/components/OfferModal";
import { AuthModal } from "@/components/AuthModal";
import { UserProfile } from "@/components/UserProfile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WinTicker } from "@/components/WinTicker";
import { PromoBox } from "@/components/PromoBox";
import { LotteryBanner } from "@/components/LotteryBanner";
import { Toaster } from "sonner";

interface IndexProps {
  initialBalance?: number;
  setGlobalBalance?: React.Dispatch<React.SetStateAction<number>>;
}

const Index = ({ initialBalance = 0, setGlobalBalance }: IndexProps) => {
  const [balance, setBalance] = useState(initialBalance);
  const [bonusBalance, setBonusBalance] = useState(0);
  const [bonusWager, setBonusWager] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showBonusAlert, setShowBonusAlert] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [didUseFreeBonusCode, setDidUseFreeBonusCode] = useState(false);

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    const usedFreeBonusCode = localStorage.getItem("usedPromoFREE150") === "true";
    
    if (email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setIsAdmin(adminStatus);
    }
    
    setDidUseFreeBonusCode(usedFreeBonusCode);
  }, []);

  // Sync balance with global state
  useEffect(() => {
    if (setGlobalBalance) {
      setGlobalBalance(balance);
    }
    
    // Save to localStorage for persistence
    localStorage.setItem('userBalance', balance.toString());
  }, [balance, setGlobalBalance]);

  // Check for bonus balance in localStorage
  useEffect(() => {
    const savedBonusBalance = localStorage.getItem('bonusBalance');
    const savedBonusWager = localStorage.getItem('bonusWager');
    
    if (savedBonusBalance) {
      setBonusBalance(parseFloat(savedBonusBalance));
    }
    
    if (savedBonusWager) {
      setBonusWager(parseFloat(savedBonusWager));
    }
  }, []);

  // Save bonus balance and wager to localStorage
  useEffect(() => {
    localStorage.setItem('bonusBalance', bonusBalance.toString());
    localStorage.setItem('bonusWager', bonusWager.toString());
  }, [bonusBalance, bonusWager]);

  // Автоматически показываем бонусное предложение новым пользователям
  useEffect(() => {
    if (isLoggedIn) {
      const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
      if (!hasVisitedBefore) {
        setShowBonusAlert(true);
        localStorage.setItem("hasVisitedBefore", "true");
      }
    }
  }, [isLoggedIn]);

  // Обработчик входа в систему
  const handleLogin = (userData: { email: string; isAdmin: boolean }) => {
    setIsLoggedIn(true);
    setUserEmail(userData.email);
    setIsAdmin(userData.isAdmin);
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setIsAdmin(false);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
  };

  const activateBonus = () => {
    if (isLoggedIn) {
      setBonusBalance(1500);
      setBonusWager(1500 * 20); // x20 вейджер
      setShowBonusAlert(false);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const processWager = (amount: number) => {
    if (bonusWager > 0) {
      const newWager = Math.max(0, bonusWager - amount);
      setBonusWager(newWager);
      
      // Если отыгрыш завершен, перевести бонусный баланс в основной
      if (newWager === 0 && bonusBalance > 0) {
        setBalance(prev => prev + bonusBalance);
        setBonusBalance(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <CasinoHeader 
        balance={balance}
        bonusBalance={bonusBalance}
        onDepositClick={() => isLoggedIn ? setIsPaymentModalOpen(true) : setIsAuthModalOpen(true)}
        onWithdrawClick={() => isLoggedIn ? setIsWithdrawModalOpen(true) : setIsAuthModalOpen(true)}
        onPromoClick={() => isLoggedIn ? setIsPromoModalOpen(true) : setIsAuthModalOpen(true)}
        onLoginClick={() => setIsAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        {showBonusAlert && isLoggedIn && (
          <Alert className="mb-6 bg-purple-900 border-purple-700">
            <AlertDescription className="flex items-center justify-between">
              <span>
                🎁 Получите бонус 1500 ₽ на ваш первый депозит! Вейджер x20.
              </span>
              <Button onClick={activateBonus} variant="secondary">
                Активировать
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <DiceGame 
              balance={balance} 
              bonusBalance={bonusBalance}
              setBalance={setBalance} 
              setBonusBalance={setBonusBalance}
              processWager={processWager}
              isLoggedIn={isLoggedIn}
              onLoginClick={() => setIsAuthModalOpen(true)}
            />
            
            <div className="mt-6">
              <WinTicker />
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <UserProfile 
              balance={balance}
              bonusBalance={bonusBalance}
              bonusWager={bonusWager}
              isLoggedIn={isLoggedIn}
              userEmail={userEmail}
              onLoginClick={() => setIsAuthModalOpen(true)}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => isLoggedIn ? setIsPaymentModalOpen(true) : setIsAuthModalOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Пополнить
              </Button>
              <Button 
                onClick={() => isLoggedIn ? setIsWithdrawModalOpen(true) : setIsAuthModalOpen(true)}
                className="bg-purple-700 hover:bg-purple-800"
              >
                Вывести
              </Button>
              <Button 
                onClick={() => isLoggedIn ? setIsPromoModalOpen(true) : setIsAuthModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Промокод
              </Button>
              <Button 
                onClick={() => setIsOfferModalOpen(true)}
                variant="outline"
              >
                Оферта
              </Button>
            </div>
            
            <PromoBox 
              isLoggedIn={isLoggedIn}
              onLoginClick={() => setIsAuthModalOpen(true)}
              onPromoClick={() => setIsPromoModalOpen(true)}
              setBalance={setBalance}
              alreadyUsed={didUseFreeBonusCode}
            />
            
            <LotteryBanner 
              onDepositClick={() => isLoggedIn ? setIsPaymentModalOpen(true) : setIsAuthModalOpen(true)}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-[#222] py-6 text-center text-sm text-gray-400">
        <div className="container mx-auto">
          <p>© 2025 Dice Casino. Все права защищены.</p>
          <div className="mt-2 space-x-4">
            <button onClick={() => setIsOfferModalOpen(true)} className="hover:text-white">
              Пользовательское соглашение
            </button>
            <span>|</span>
            <Link to="/payment-callback" className="hover:text-white">
              Проверить платеж
            </Link>
          </div>
        </div>
      </footer>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        setBalance={setBalance}
        userEmail={userEmail}
      />
      
      <WithdrawModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)}
        balance={balance}
        setBalance={setBalance}
      />
      
      <PromoModal 
        isOpen={isPromoModalOpen} 
        onClose={() => setIsPromoModalOpen(false)}
        setBalance={setBalance}
        setBonusBalance={setBonusBalance}
        setBonusWager={setBonusWager}
      />
      
      <OfferModal 
        isOpen={isOfferModalOpen} 
        onClose={() => setIsOfferModalOpen(false)}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
      
      <Toaster position="top-right" />
    </div>
  );
};

export default Index;
