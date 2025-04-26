
import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

export const WithdrawModal = ({ isOpen, onClose, balance, setBalance }: WithdrawModalProps) => {
  const [amount, setAmount] = useState(500);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const handleWithdraw = () => {
    // Проверка суммы вывода
    if (amount > balance) {
      setError("Недостаточно средств для вывода");
      return;
    }
    
    if (amount < 500) {
      setError("Минимальная сумма вывода: 500 ₽");
      return;
    }
    
    if (!withdrawAddress) {
      setError("Укажите адрес для вывода средств");
      return;
    }
    
    setError("");
    setIsProcessing(true);
    
    // Имитация процесса вывода средств
    setTimeout(() => {
      setIsProcessing(false);
      setWithdrawSuccess(true);
      setBalance(prev => prev - amount);
      
      // Закрываем модальное окно через 3 секунды после успешного вывода
      setTimeout(() => {
        onClose();
        setWithdrawSuccess(false);
        setWithdrawAddress("");
      }, 3000);
    }, 2000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1F2C] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Вывод средств</DialogTitle>
        </DialogHeader>
        
        {withdrawSuccess ? (
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
            <h3 className="text-lg font-medium text-green-500">Запрос на вывод отправлен!</h3>
            <p className="mt-2">Сумма {amount} ₽ будет отправлена на указанные реквизиты</p>
            <p className="mt-1 text-sm text-gray-400">Обработка занимает от 15 минут до 24 часов</p>
          </div>
        ) : (
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="card">Банк. карта</TabsTrigger>
              <TabsTrigger value="yoomoney">ЮMoney</TabsTrigger>
              <TabsTrigger value="crypto">Криптовалюта</TabsTrigger>
            </TabsList>
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="bg-[#111] p-3 rounded-lg mt-4 flex justify-between items-center">
              <span>Доступно для вывода:</span>
              <span className="font-bold">{balance.toFixed(2)} ₽</span>
            </div>
            
            <TabsContent value="card" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="card-number">Номер карты</Label>
                <Input
                  id="card-number"
                  placeholder="0000 0000 0000 0000"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="card-amount">Сумма</Label>
                <Input
                  id="card-amount"
                  type="number"
                  min={500}
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <p className="text-xs text-gray-400">
                Комиссия за вывод на карту: 2%
              </p>
              
              <Button 
                onClick={handleWithdraw} 
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isProcessing}
              >
                {isProcessing ? "Обработка..." : "Вывести средства"}
              </Button>
            </TabsContent>
            
            <TabsContent value="yoomoney" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="yoomoney-wallet">Номер кошелька ЮMoney</Label>
                <Input
                  id="yoomoney-wallet"
                  placeholder="41001XXXXXXXXXX"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="yoomoney-amount">Сумма</Label>
                <Input
                  id="yoomoney-amount"
                  type="number"
                  min={500}
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <p className="text-xs text-gray-400">
                Комиссия за вывод на ЮMoney: 1%
              </p>
              
              <Button 
                onClick={handleWithdraw} 
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isProcessing}
              >
                {isProcessing ? "Обработка..." : "Вывести средства"}
              </Button>
            </TabsContent>
            
            <TabsContent value="crypto" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="crypto-type">Тип криптовалюты</Label>
                <select 
                  id="crypto-type"
                  className="w-full bg-[#333] rounded-md p-2 mt-1"
                >
                  <option value="btc">Bitcoin (BTC)</option>
                  <option value="eth">Ethereum (ETH)</option>
                  <option value="usdt">Tether (USDT)</option>
                  <option value="doge">Dogecoin (DOGE)</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="crypto-address">Адрес кошелька</Label>
                <Input
                  id="crypto-address"
                  placeholder="Введите адрес вашего криптокошелька"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="crypto-amount">Сумма (₽)</Label>
                <Input
                  id="crypto-amount"
                  type="number"
                  min={500}
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <div className="bg-[#111] p-3 rounded-lg text-xs text-gray-300">
                <p>Курс обмена:</p>
                <p className="mt-1">1 BTC = 4,875,000 ₽</p>
                <p>1 ETH = 230,000 ₽</p>
                <p>1 USDT = 90 ₽</p>
              </div>
              
              <Button 
                onClick={handleWithdraw} 
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isProcessing}
              >
                {isProcessing ? "Обработка..." : "Вывести средства"}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
