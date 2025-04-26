
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Мокап данных для генерации фейковых выигрышей
const names = [
  "Александр", "Сергей", "Иван", "Дмитрий", "Екатерина", 
  "Мария", "Анна", "Ольга", "Андрей", "Михаил", 
  "Артем", "Владимир", "Татьяна", "Елена", "Максим",
  "Никита", "Алексей", "Светлана", "Наталья", "Виктор"
];

const games = ["Dice", "Roulette", "Blackjack", "Slots", "Poker"];

interface FakeWin {
  id: string;
  name: string;
  amount: number;
  game: string;
  timestamp: Date;
  multiplier?: number;
}

export function WinTicker() {
  const [wins, setWins] = useState<FakeWin[]>([]);
  
  // Генерация случайного выигрыша
  const generateRandomWin = (): FakeWin => {
    const name = names[Math.floor(Math.random() * names.length)];
    const game = games[Math.floor(Math.random() * games.length)];
    const amount = Math.floor(Math.random() * 9000) + 100; // 100-10000 рублей
    const multiplier = game === "Dice" ? parseFloat((Math.random() * 9 + 1.1).toFixed(2)) : undefined;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      amount,
      game,
      timestamp: new Date(),
      multiplier
    };
  };
  
  // Инициализация начальных данных
  useEffect(() => {
    const initialWins = Array(10)
      .fill(null)
      .map(() => generateRandomWin());
    
    setWins(initialWins);
    
    // Добавление новых выигрышей каждые 3-8 секунд
    const interval = setInterval(() => {
      const newWin = generateRandomWin();
      setWins(prev => [newWin, ...prev.slice(0, 9)]);
    }, Math.floor(Math.random() * 5000) + 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Форматирование времени
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Если нет данных, не показываем компонент
  if (wins.length === 0) return null;
  
  return (
    <div className="bg-[#222] rounded-lg overflow-hidden shadow-lg">
      <div className="bg-purple-900 text-white py-2 px-4 font-medium flex items-center justify-between">
        <h3>Последние выигрыши</h3>
        <Badge variant="outline" className="bg-purple-700">Live</Badge>
      </div>
      
      <div className="overflow-hidden max-h-[300px]">
        <div className="p-2">
          {wins.map((win) => (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#333] mb-1"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-xs font-bold">
                  {win.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{win.name}</div>
                  <div className="text-xs text-gray-400">{win.game}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-green-500">
                  +{win.amount.toLocaleString()} ₽
                  {win.multiplier && <span className="text-xs ml-1 text-gray-400">x{win.multiplier}</span>}
                </div>
                <div className="text-xs text-gray-400">{formatTime(win.timestamp)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
