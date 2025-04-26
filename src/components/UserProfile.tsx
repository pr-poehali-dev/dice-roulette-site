
import { Progress } from "@/components/ui/progress";

interface UserProfileProps {
  balance: number;
  bonusBalance: number;
  bonusWager: number;
}

export const UserProfile = ({ 
  balance, 
  bonusBalance, 
  bonusWager 
}: UserProfileProps) => {
  // Расчет процента отыгрыша бонуса
  const wagerProgress = bonusBalance > 0 
    ? Math.max(0, Math.min(100, 100 - (bonusWager / (bonusBalance * 20) * 100)))
    : 0;

  return (
    <div className="bg-[#222] rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Профиль игрока</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm text-gray-400 mb-1">Основной баланс</h3>
          <p className="text-2xl font-bold">{balance.toFixed(2)} ₽</p>
        </div>
        
        {bonusBalance > 0 && (
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Бонусный баланс</h3>
            <p className="text-xl font-bold text-purple-400">{bonusBalance.toFixed(2)} ₽</p>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Отыгрыш бонуса</span>
                <span>{wagerProgress.toFixed(0)}%</span>
              </div>
              <Progress value={wagerProgress} className="h-2" />
              <p className="text-xs text-gray-400 mt-1">
                Осталось отыграть: {bonusWager.toFixed(0)} ₽
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h3 className="text-sm font-medium mb-3">Статистика</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-[#333] p-3 rounded-lg">
              <p className="text-gray-400">Всего игр</p>
              <p className="text-lg font-medium">0</p>
            </div>
            <div className="bg-[#333] p-3 rounded-lg">
              <p className="text-gray-400">Выигрыши</p>
              <p className="text-lg font-medium">0</p>
            </div>
            <div className="bg-[#333] p-3 rounded-lg">
              <p className="text-gray-400">Макс. выигрыш</p>
              <p className="text-lg font-medium">0 ₽</p>
            </div>
            <div className="bg-[#333] p-3 rounded-lg">
              <p className="text-gray-400">Win Rate</p>
              <p className="text-lg font-medium">0%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
