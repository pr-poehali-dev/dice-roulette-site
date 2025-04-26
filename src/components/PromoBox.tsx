
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Gift, Sparkles, ArrowRight } from "lucide-react";

interface PromoBoxProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onPromoClick: () => void;
  setBalance?: React.Dispatch<React.SetStateAction<number>>;
  alreadyUsed?: boolean;
}

export function PromoBox({ isLoggedIn, onLoginClick, onPromoClick, setBalance, alreadyUsed = false }: PromoBoxProps) {
  const [promoCode, setPromoCode] = useState("FREE150");
  const [applied, setApplied] = useState(alreadyUsed);
  
  const handleApplyPromo = () => {
    if (!isLoggedIn) {
      onLoginClick();
      return;
    }
    
    if (applied) {
      toast.error("Вы уже использовали этот промокод");
      return;
    }
    
    if (promoCode.toUpperCase() === "FREE150") {
      if (setBalance) {
        setBalance(prev => prev + 150);
      }
      setApplied(true);
      toast.success("Промокод активирован! +150 ₽ на ваш баланс");
      
      // Сохраняем использование промокода в localStorage
      localStorage.setItem("usedPromoFREE150", "true");
    } else {
      onPromoClick(); // Открыть модальное окно с промокодами
    }
  };
  
  return (
    <Card className="border-purple-800 bg-[#222]">
      <CardHeader className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-t-lg pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Gift className="mr-2 h-5 w-5" />
            Бонус для новых игроков
          </CardTitle>
          <Sparkles className="h-5 w-5 text-yellow-300" />
        </div>
        <CardDescription className="text-white/70">
          Получите бонус 150 ₽ на ваш счет прямо сейчас!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex space-x-2">
          <Input
            className="bg-[#333]"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Введите промокод"
            disabled={applied}
          />
          <Button 
            variant={applied ? "outline" : "default"} 
            className={applied ? "border-green-600 text-green-500" : "bg-purple-700 hover:bg-purple-800"}
            onClick={handleApplyPromo}
            disabled={applied}
          >
            {applied ? "Активирован" : "Активировать"}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <button 
          onClick={onPromoClick}
          className="w-full text-sm text-gray-400 hover:text-white flex items-center justify-center"
        >
          Другие промокоды <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      </CardFooter>
    </Card>
  );
}
