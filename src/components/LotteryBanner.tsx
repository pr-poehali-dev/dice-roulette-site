
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Ticket, TrendingUp, PiggyBank } from "lucide-react";

interface LotteryBannerProps {
  onDepositClick: () => void;
}

export function LotteryBanner({ onDepositClick }: LotteryBannerProps) {
  // Генерация случайных сумм для текущего розыгрыша
  const generatePrizes = () => {
    const mainPrize = Math.floor(Math.random() * 5000) + 5000; // 5000-10000 рублей
    const secondPrize = Math.floor(Math.random() * 3000) + 2000; // 2000-5000 рублей
    const thirdPrize = Math.floor(Math.random() * 1000) + 1000; // 1000-2000 рублей
    
    return { mainPrize, secondPrize, thirdPrize };
  };
  
  const { mainPrize, secondPrize, thirdPrize } = generatePrizes();
  
  return (
    <Card className="border-yellow-800 bg-[#222]">
      <CardHeader className="bg-gradient-to-r from-yellow-800 to-yellow-600 rounded-t-lg pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Ticket className="mr-2 h-5 w-5" />
            Розыгрыш за пополнение
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <CardDescription className="text-white/70">
          Пополните счет от 100 ₽ и участвуйте в розыгрыше призов
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="ml-2">Главный приз</span>
            </div>
            <span className="font-bold text-yellow-500">{mainPrize.toLocaleString()} ₽</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="ml-2">Второй приз</span>
            </div>
            <span className="font-bold text-gray-300">{secondPrize.toLocaleString()} ₽</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-900 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="ml-2">Третий приз</span>
            </div>
            <span className="font-bold text-yellow-700">{thirdPrize.toLocaleString()} ₽</span>
          </div>
        </div>
        
        <div className="mt-4 bg-[#111] p-3 rounded-lg text-xs text-gray-400">
          <p className="flex items-center">
            <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
            Розыгрыш каждые 24 часа
          </p>
          <p className="flex items-center mt-1">
            <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
            Минимальное пополнение 100 ₽
          </p>
          <p className="flex items-center mt-1">
            <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
            Шанс победы зависит от суммы пополнения
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onDepositClick}
          className="w-full bg-yellow-600 hover:bg-yellow-700 flex items-center justify-center"
        >
          <PiggyBank className="mr-2 h-4 w-4" />
          Пополнить и участвовать
        </Button>
      </CardFooter>
    </Card>
  );
}
