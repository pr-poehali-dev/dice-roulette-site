
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setBonusBalance: React.Dispatch<React.SetStateAction<number>>;
  setBonusWager: React.Dispatch<React.SetStateAction<number>>;
}

// Список доступных промокодов и их преимущества
const DEFAULT_PROMO_CODES = {
  "WELCOME2025": { type: "bonus", amount: 1500, wagerMultiplier: 20 },
  "DICE100": { type: "balance", amount: 100, wagerMultiplier: 0 },
  "FREESPIN": { type: "bonus", amount: 500, wagerMultiplier: 15 },
  "VIP2025": { type: "balance", amount: 250, wagerMultiplier: 0 },
  "LUCK777": { type: "bonus", amount: 777, wagerMultiplier: 25 },
  "FREE150": { type: "balance", amount: 150, wagerMultiplier: 0 },
};

export const PromoModal = ({ 
  isOpen, 
  onClose, 
  setBalance, 
  setBonusBalance, 
  setBonusWager 
}: PromoModalProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activatedPromoInfo, setActivatedPromoInfo] = useState<{
    code: string;
    amount: number;
    type: string;
  } | null>(null);
  const [availablePromoCodes, setAvailablePromoCodes] = useState<any>(DEFAULT_PROMO_CODES);
  const [usedPromoCodes, setUsedPromoCodes] = useState<string[]>([]);
  
  // Загружаем использованные промокоды из localStorage при открытии
  useEffect(() => {
    if (isOpen) {
      const usedCodes = JSON.parse(localStorage.getItem("usedPromoCodes") || "[]");
      setUsedPromoCodes(usedCodes);
      
      // Загружаем кастомные промокоды из админки
      const customPromoCodes = JSON.parse(localStorage.getItem("customPromoCodes") || "{}");
      setAvailablePromoCodes({...DEFAULT_PROMO_CODES, ...customPromoCodes});
      
      // Проверяем, использован ли FREE150
      if (localStorage.getItem("usedPromoFREE150") === "true") {
        setUsedPromoCodes(prev => 
          prev.includes("FREE150") ? prev : [...prev, "FREE150"]
        );
      }
    }
  }, [isOpen]);
  
  // Активация промокода
  const activatePromoCode = () => {
    if (!promoCode.trim()) {
      setError("Введите промокод");
      return;
    }
    
    // Проверяем, не был ли промокод уже использован
    if (usedPromoCodes.includes(promoCode.toUpperCase())) {
      setError("Этот промокод уже был использован");
      return;
    }
    
    setError("");
    setIsProcessing(true);
    
    // Имитация проверки промокода
    setTimeout(() => {
      setIsProcessing(false);
      
      // Проверяем наличие промокода в списке
      const promo = availablePromoCodes[promoCode.toUpperCase()];
      
      if (promo) {
        // Промокод действителен
        setPromoSuccess(true);
        setActivatedPromoInfo({
          code: promoCode.toUpperCase(),
          amount: promo.amount,
          type: promo.type
        });
        
        // Применяем бонус
        if (promo.type === "balance") {
          setBalance(prev => prev + promo.amount);
        } else if (promo.type === "bonus") {
          setBonusBalance(prev => prev + promo.amount);
          setBonusWager(prev => prev + (promo.amount * promo.wagerMultiplier));
        }
        
        // Сохраняем промокод как использованный
        const updatedUsedCodes = [...usedPromoCodes, promoCode.toUpperCase()];
        setUsedPromoCodes(updatedUsedCodes);
        localStorage.setItem("usedPromoCodes", JSON.stringify(updatedUsedCodes));
        
        // Если это FREE150, сохраняем специальный флаг
        if (promoCode.toUpperCase() === "FREE150") {
          localStorage.setItem("usedPromoFREE150", "true");
        }
        
        // Очищаем поле
        setPromoCode("");
        
        // Уведомляем пользователя
        toast.success(`Промокод активирован! +${promo.amount} ₽ ${promo.type === "bonus" ? "бонусами" : "на баланс"}`);
      } else {
        // Промокод недействителен
        setError("Недействительный промокод");
      }
    }, 1000);
  };
  
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPromoSuccess(false);
      setActivatedPromoInfo(null);
      setError("");
    }, 300);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1A1F2C] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {promoSuccess ? "Промокод активирован!" : "Активация промокода"}
          </DialogTitle>
        </DialogHeader>
        
        {promoSuccess && activatedPromoInfo ? (
          <div className="py-8 text-center">
            <div className="mb-4 mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-green-500">
              {activatedPromoInfo.code}
            </h3>
            <div className="mt-4 p-4 bg-[#111] rounded-lg">
              <p className="text-lg">
                <span className="text-purple-400">
                  +{activatedPromoInfo.amount} ₽
                </span>{" "}
                {activatedPromoInfo.type === "bonus" ? "бонусами" : "на баланс"}
              </p>
              {activatedPromoInfo.type === "bonus" && (
                <p className="text-sm text-gray-400 mt-1">
                  Требуется отыграть x{availablePromoCodes[activatedPromoInfo.code].wagerMultiplier}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="promo-code">Введите промокод</Label>
                <Input
                  id="promo-code"
                  placeholder="WELCOME2025"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <Button 
                onClick={activatePromoCode} 
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isProcessing}
              >
                {isProcessing ? "Проверка..." : "Активировать промокод"}
              </Button>
              
              <div className="p-4 bg-[#111] rounded-lg">
                <h3 className="text-sm font-medium mb-2">Доступные промокоды:</h3>
                <ul className="text-xs space-y-1 text-gray-300">
                  <li className={usedPromoCodes.includes("FREE150") ? "line-through text-gray-500" : ""}>
                    • FREE150 — 150 ₽ на баланс (для новых игроков)
                  </li>
                  <li className={usedPromoCodes.includes("WELCOME2025") ? "line-through text-gray-500" : ""}>
                    • WELCOME2025 — 1500 ₽ бонусами (вейджер x20)
                  </li>
                  <li className={usedPromoCodes.includes("DICE100") ? "line-through text-gray-500" : ""}>
                    • DICE100 — 100 ₽ на баланс
                  </li>
                  <li className={usedPromoCodes.includes("FREESPIN") ? "line-through text-gray-500" : ""}>
                    • FREESPIN — 500 ₽ бонусами (вейджер x15)
                  </li>
                  <li>• И другие скрытые промокоды!</li>
                </ul>
              </div>
            </div>
          </>
        )}
        
        <DialogFooter className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            {promoSuccess ? "Закрыть" : "Отмена"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
