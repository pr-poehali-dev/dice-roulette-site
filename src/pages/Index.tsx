
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CasinoHeader } from "@/components/CasinoHeader";
import { DiceGame } from "@/components/DiceGame";
import { PaymentModal } from "@/components/PaymentModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { PromoModal } from "@/components/PromoModal";
import { OfferModal } from "@/components/OfferModal";
import { UserProfile } from "@/components/UserProfile";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [balance, setBalance] = useState(0);
  const [bonusBalance, setBonusBalance] = useState(0);
  const [bonusWager, setBonusWager] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [showBonusAlert, setShowBonusAlert] = useState(false);

  // Автоматически показываем бонусное предложение новым пользователям
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    if (!hasVisitedBefore) {
      setShowBonusAlert(true);
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  const activateBonus = () => {
    setBonusBalance(1500);
    setBonusWager(1500 * 20); // x20 вейджер
    setShowBonusAlert(false);
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
        onDepositClick={() => setIsPaymentModalOpen(true)}
        onWithdrawClick={() => setIsWithdrawModalOpen(true)}
        onPromoClick={() => setIsPromoModalOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        {showBonusAlert && (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DiceGame 
              balance={balance} 
              bonusBalance={bonusBalance}
              setBalance={setBalance} 
              setBonusBalance={setBonusBalance}
              processWager={processWager}
            />
          </div>
          
          <div>
            <UserProfile 
              balance={balance}
              bonusBalance={bonusBalance}
              bonusWager={bonusWager}
            />
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Пополнить
              </Button>
              <Button 
                onClick={() => setIsWithdrawModalOpen(true)}
                className="bg-purple-700 hover:bg-purple-800"
              >
                Вывести
              </Button>
              <Button 
                onClick={() => setIsPromoModalOpen(true)}
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
            <Link to="/privacy" className="hover:text-white">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </footer>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        setBalance={setBalance}
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
    </div>
  );
};

export default Index;
