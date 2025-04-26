
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CasinoHeaderProps {
  balance: number;
  bonusBalance: number;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
  onPromoClick: () => void;
}

export const CasinoHeader = ({
  balance,
  bonusBalance,
  onDepositClick,
  onWithdrawClick,
  onPromoClick
}: CasinoHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#111827] py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-purple-500 mr-1">Dice</span>
            <span className="text-2xl font-bold text-white">Casino</span>
          </Link>
          
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link to="/" className="text-white hover:text-purple-400 font-medium">
              Главная
            </Link>
            <Link to="/bonuses" className="text-gray-300 hover:text-purple-400">
              Бонусы
            </Link>
            <Link to="/faq" className="text-gray-300 hover:text-purple-400">
              FAQ
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block">
            <div className="flex items-center gap-4">
              <div className="bg-[#222] px-3 py-2 rounded-lg">
                <p className="text-xs text-gray-400">Баланс</p>
                <p className="font-medium">{balance.toFixed(2)} ₽</p>
              </div>
              
              {bonusBalance > 0 && (
                <div className="bg-purple-900 px-3 py-2 rounded-lg">
                  <p className="text-xs text-gray-300">Бонус</p>
                  <p className="font-medium">{bonusBalance.toFixed(2)} ₽</p>
                </div>
              )}
              
              <Button 
                onClick={onDepositClick}
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8"
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Avatar onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer hover:ring-2 hover:ring-purple-500">
              <AvatarFallback className="bg-purple-800">ИК</AvatarFallback>
            </Avatar>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#222] rounded-lg shadow-xl z-10">
                <button 
                  onClick={onDepositClick}
                  className="w-full px-4 py-2 text-left hover:bg-[#333] text-sm"
                >
                  Пополнить счет
                </button>
                <button 
                  onClick={onWithdrawClick}
                  className="w-full px-4 py-2 text-left hover:bg-[#333] text-sm"
                >
                  Вывести средства
                </button>
                <button 
                  onClick={onPromoClick}
                  className="w-full px-4 py-2 text-left hover:bg-[#333] text-sm"
                >
                  Ввести промокод
                </button>
                <hr className="my-1 border-[#444]" />
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-[#333] text-sm"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
          
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
