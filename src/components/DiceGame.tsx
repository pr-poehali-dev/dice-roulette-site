
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiceGameProps {
  balance: number;
  bonusBalance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setBonusBalance: React.Dispatch<React.SetStateAction<number>>;
  processWager: (amount: number) => void;
}

export const DiceGame = ({
  balance,
  bonusBalance,
  setBalance,
  setBonusBalance,
  processWager
}: DiceGameProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [winChance, setWinChance] = useState(47);
  const [multiplier, setMultiplier] = useState(2.13);
  const [potentialWin, setPotentialWin] = useState(21.3);
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState("");
  const [gameHistory, setGameHistory] = useState<Array<{
    id: number;
    bet: number;
    chance: number;
    multiplier: number;
    result: number;
    win: boolean;
  }>>([]);
  const [useBonus, setUseBonus] = useState(false);
  const [quickBets, setQuickBets] = useState([10, 50, 100, 500]);

  // Обновление множителя и потенциального выигрыша
  useEffect(() => {
    // Формула множителя: 100 / шанс на выигрыш * (1 - комиссия)
    const houseEdge = 0.05; // 5% комиссия казино
    const newMultiplier = parseFloat(((100 / winChance) * (1 - houseEdge)).toFixed(2));
    setMultiplier(newMultiplier);
    
    // Расчёт потенциального выигрыша
    setPotentialWin(parseFloat((betAmount * newMultiplier).toFixed(2)));
  }, [winChance, betAmount]);

  // Обработка изменения слайдера шанса
  const handleChanceChange = (value: number[]) => {
    const newChance = value[0];
    setWinChance(newChance);
  };

  // Функция для проверки случайного числа
  const rollDice = () => {
    if ((useBonus && bonusBalance < betAmount) || (!useBonus && balance < betAmount)) {
      setResultMessage("Недостаточно средств для ставки");
      return;
    }

    setIsRolling(true);
    
    // Снимаем ставку с баланса
    if (useBonus) {
      setBonusBalance(prev => prev - betAmount);
    } else {
      setBalance(prev => prev - betAmount);
    }
    
    // Обрабатываем вейджер бонуса
    processWager(betAmount);

    setTimeout(() => {
      // Генерируем случайное число от 0 до 100
      const result = Math.floor(Math.random() * 100);
      setLastResult(result);
      
      // Определяем результат
      const isWin = result <= winChance;
      
      if (isWin) {
        const winAmount = betAmount * multiplier;
        if (useBonus) {
          setBonusBalance(prev => prev + winAmount);
        } else {
          setBalance(prev => prev + winAmount);
        }
        
        setResultMessage(`Победа! +${winAmount.toFixed(2)} ₽`);
      } else {
        setResultMessage(`Проигрыш! Выпало ${result}`);
      }
      
      // Добавляем результат в историю
      setGameHistory(prev => [{
        id: Date.now(),
        bet: betAmount,
        chance: winChance,
        multiplier: multiplier,
        result: result,
        win: isWin
      }, ...prev.slice(0, 9)]);
      
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="bg-[#222] rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Dice Game</h2>
      
      <Tabs defaultValue="classic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="classic">Классический</TabsTrigger>
          <TabsTrigger value="advanced">Продвинутый</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Сумма ставки</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  type="number"
                  min={1}
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="bg-[#333]"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBetAmount(prev => prev * 2)}
                >
                  x2
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBetAmount(prev => prev / 2)}
                >
                  /2
                </Button>
              </div>
              
              <div className="flex space-x-2 mb-4">
                {quickBets.map((bet) => (
                  <Button
                    key={bet}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(bet)}
                    className="flex-1"
                  >
                    {bet}₽
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Шанс выигрыша: {winChance}%</label>
              <Slider
                value={[winChance]}
                min={1}
                max={95}
                step={1}
                onValueChange={handleChanceChange}
                className="mb-4"
              />
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>Множитель: x{multiplier}</span>
                <span>Возможный выигрыш: {potentialWin.toFixed(2)} ₽</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-[#1a1a1a] rounded-lg text-center">
            {lastResult !== null ? (
              <div className="mb-4">
                <h3 className="text-4xl font-bold mb-2">{lastResult}</h3>
                <p className={`text-lg ${resultMessage.includes("Победа") ? "text-green-500" : "text-red-500"}`}>
                  {resultMessage}
                </p>
              </div>
            ) : (
              <p className="text-lg mb-4">Сделайте ставку и нажмите ROLL</p>
            )}
            
            <div className="flex items-center justify-center space-x-4">
              {bonusBalance > 0 && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useBonus"
                    checked={useBonus}
                    onChange={() => setUseBonus(!useBonus)}
                    className="mr-2"
                  />
                  <label htmlFor="useBonus" className="text-sm">
                    Использовать бонусный баланс
                  </label>
                </div>
              )}
              
              <Button
                onClick={rollDice}
                disabled={isRolling}
                className="px-8 py-2 bg-purple-700 hover:bg-purple-800 text-lg"
              >
                {isRolling ? "ROLLING..." : "ROLL"}
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">История ставок</h3>
            <div className="bg-[#333] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#444]">
                    <th className="p-2 text-left">Ставка</th>
                    <th className="p-2 text-left">Шанс</th>
                    <th className="p-2 text-left">Множитель</th>
                    <th className="p-2 text-left">Результат</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((game) => (
                    <tr key={game.id} className="border-t border-[#444]">
                      <td className="p-2">{game.bet} ₽</td>
                      <td className="p-2">{game.chance}%</td>
                      <td className="p-2">x{game.multiplier}</td>
                      <td className={`p-2 ${game.win ? "text-green-500" : "text-red-500"}`}>
                        {game.result} ({game.win ? "Win" : "Loss"})
                      </td>
                    </tr>
                  ))}
                  {gameHistory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500">
                        История ставок пуста
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="text-center p-6 bg-[#333] rounded-lg">
            <p>Продвинутый режим будет доступен в следующем обновлении!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
