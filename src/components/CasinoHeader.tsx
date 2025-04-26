
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { Link } from "react-router-dom";

interface CasinoHeaderProps {
  balance: number;
  bonusBalance: number;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
  onPromoClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
  isAdmin?: boolean;
  onLogout: () => void;
}

export const CasinoHeader = ({
  balance,
  bonusBalance,
  onDepositClick,
  onWithdrawClick,
  onPromoClick,
  onLoginClick,
  isLoggedIn,
  userEmail,
  isAdmin,
  onLogout
}: CasinoHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Закрытие мобильного меню при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <header className="bg-[#111827] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-purple-500" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">Dice Casino</span>
            </Link>
            
            <nav className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Главная
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                  Админ-панель
                </Link>
              )}
              <Link to="/payment-callback" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Проверить платеж
              </Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex flex-col text-right mr-2">
                  <span className="text-sm text-gray-400">Баланс:</span>
                  <span className="font-bold text-white">
                    {balance.toFixed(2)} ₽
                    {bonusBalance > 0 && (
                      <span className="text-purple-400 ml-1">+{bonusBalance.toFixed(2)} ₽</span>
                    )}
                  </span>
                </div>
                
                <Button 
                  onClick={onDepositClick}
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                >
                  Пополнить
                </Button>
                
                <Button 
                  onClick={onWithdrawClick}
                  size="sm" 
                  variant="outline"
                >
                  Вывести
                </Button>
                
                <Button 
                  onClick={onPromoClick}
                  size="sm" 
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  Промокод
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full p-1">
                      <Avatar>
                        <AvatarFallback className="bg-purple-700">
                          {userEmail?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 bg-[#1A1F2C] border-gray-700">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-300 truncate">
                        {userEmail}
                      </p>
                      {isAdmin && (
                        <p className="text-xs text-purple-400">Администратор</p>
                      )}
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
                          >
                            Админ-панель
                          </Link>
                        )}
                        <button
                          onClick={onLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md"
                        >
                          Выйти
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <Button 
                onClick={onLoginClick}
                className="bg-purple-700 hover:bg-purple-800"
              >
                Войти
              </Button>
            )}
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Открыть меню</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1A1F2C]" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900"
            >
              Главная
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Админ-панель
              </Link>
            )}
            
            <Link
              to="/payment-callback"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Проверить платеж
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isLoggedIn ? (
              <div>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarFallback className="bg-purple-700">
                        {userEmail?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white truncate max-w-[150px]">
                      {userEmail}
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      Баланс: {balance.toFixed(2)} ₽
                      {bonusBalance > 0 && (
                        <span className="text-purple-400"> +{bonusBalance.toFixed(2)} ₽</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button
                    onClick={onDepositClick}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    Пополнить
                  </button>
                  <button
                    onClick={onWithdrawClick}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    Вывести
                  </button>
                  <button
                    onClick={onPromoClick}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    Промокод
                  </button>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      Админ-панель
                    </Link>
                  )}
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-2">
                <Button 
                  onClick={onLoginClick}
                  className="w-full bg-purple-700 hover:bg-purple-800"
                >
                  Войти
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
