
import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

export const PaymentModal = ({ isOpen, onClose, setBalance }: PaymentModalProps) => {
  const [amount, setAmount] = useState(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const presetAmounts = [500, 1000, 3000, 5000, 10000];
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Имитация процесса оплаты
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setBalance(prev => prev + amount);
      
      // Закрываем модальное окно через 2 секунды после успешной оплаты
      setTimeout(() => {
        onClose();
        setPaymentSuccess(false);
      }, 2000);
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1F2C] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Пополнение баланса</DialogTitle>
        </DialogHeader>
        
        {paymentSuccess ? (
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
            <h3 className="text-lg font-medium text-green-500">Оплата успешна!</h3>
            <p className="mt-2">На ваш счет добавлено {amount} ₽</p>
          </div>
        ) : (
          <Tabs defaultValue="yoomoney" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="yoomoney">ЮMoney</TabsTrigger>
              <TabsTrigger value="card">Банк. карта</TabsTrigger>
              <TabsTrigger value="crypto">Криптовалюта</TabsTrigger>
            </TabsList>
            
            <TabsContent value="yoomoney" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="amount">Сумма пополнения</Label>
                <Input
                  id="amount"
                  type="number"
                  min={100}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-2">
                {presetAmounts.map((preset) => (
                  <Button 
                    key={preset}
                    variant="outline" 
                    onClick={() => setAmount(preset)}
                    className={amount === preset ? "bg-purple-800 border-purple-600" : ""}
                  >
                    {preset} ₽
                  </Button>
                ))}
              </div>
              
              <div className="bg-[#111] p-4 rounded-lg mt-4">
                <p className="text-sm">Реквизиты для оплаты:</p>
                <p className="font-mono text-sm mt-1 bg-[#222] p-2 rounded">4100116342286505</p>
                <p className="text-xs text-gray-400 mt-2">
                  После совершения платежа средства поступят на ваш счет автоматически
                </p>
              </div>
              
              <Button 
                onClick={handlePayment} 
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isProcessing}
              >
                {isProcessing ? "Обработка..." : "Оплатить"}
              </Button>
            </TabsContent>
            
            <TabsContent value="card" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="card-number">Номер карты</Label>
                <Input
                  id="card-number"
                  placeholder="0000 0000 0000 0000"
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Срок действия</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/ГГ"
                    className="bg-[#333] mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="000"
                    className="bg-[#333] mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="card-amount">Сумма</Label>
                <Input
                  id="card-amount"
                  type="number"
                  min={100}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <Button 
                onClick={handlePayment} 
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isProcessing}
              >
                {isProcessing ? "Обработка..." : "Оплатить"}
              </Button>
            </TabsContent>
            
            <TabsContent value="crypto" className="space-y-4 mt-4">
              <p className="text-center py-2">Выберите криптовалюту для оплаты</p>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex justify-center items-center h-20">
                  <div className="text-center">
                    <span className="text-xl">₿</span>
                    <p className="text-sm mt-1">Bitcoin</p>
                  </div>
                </Button>
                <Button variant="outline" className="flex justify-center items-center h-20">
                  <div className="text-center">
                    <span className="text-xl">Ξ</span>
                    <p className="text-sm mt-1">Ethereum</p>
                  </div>
                </Button>
                <Button variant="outline" className="flex justify-center items-center h-20">
                  <div className="text-center">
                    <span className="text-xl">Ƀ</span>
                    <p className="text-sm mt-1">USDT</p>
                  </div>
                </Button>
                <Button variant="outline" className="flex justify-center items-center h-20">
                  <div className="text-center">
                    <span className="text-xl">Ð</span>
                    <p className="text-sm mt-1">Dogecoin</p>
                  </div>
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-400 mt-2">
                Детали оплаты будут предоставлены после выбора криптовалюты
              </p>
            </TabsContent>
          </Tabs>
        )}
        
        <DialogFooter className="flex justify-between">
          <p className="text-xs text-gray-400">
            Минимальная сумма пополнения: 100 ₽
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
