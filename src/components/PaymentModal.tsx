
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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

export const PaymentModal = ({ isOpen, onClose, setBalance }: PaymentModalProps) => {
  const [amount, setAmount] = useState(1000);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'instruction'>('form');
  const [paymentId, setPaymentId] = useState<string>("");
  
  const presetAmounts = [500, 1000, 3000, 5000, 10000];
  
  // YooMoney API parameters
  const YOOMONEY_CLIENT_ID = "F91ACF4211B9B5CEF6588EB9143C24583CF449D1BAD64133904689860FAD0D82";
  const YOOMONEY_ACCOUNT = "4100116342286505";
  const REDIRECT_URI = window.location.origin + "/payment-callback";

  const handleYooMoneyRedirect = () => {
    if (amount < 100) {
      alert("Минимальная сумма пополнения 100 ₽");
      return;
    }
    
    // Generate unique payment ID
    const generatedPaymentId = `DICE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setPaymentId(generatedPaymentId);
    
    // Save payment info to localStorage to verify later
    localStorage.setItem(`payment_${generatedPaymentId}`, JSON.stringify({
      amount,
      status: 'pending',
      timestamp: Date.now()
    }));
    
    // Construct YooMoney URL with parameters
    const yoomoneyURL = new URL("https://yoomoney.ru/quickpay/confirm.xml");
    yoomoneyURL.searchParams.append("receiver", YOOMONEY_ACCOUNT);
    yoomoneyURL.searchParams.append("quickpay-form", "donate");
    yoomoneyURL.searchParams.append("targets", `Пополнение баланса в Dice Casino (ID: ${generatedPaymentId})`);
    yoomoneyURL.searchParams.append("paymentType", "AC");
    yoomoneyURL.searchParams.append("sum", amount.toString());
    yoomoneyURL.searchParams.append("label", generatedPaymentId);
    yoomoneyURL.searchParams.append("successURL", REDIRECT_URI);
    
    // Show instructions before redirect
    setPaymentStep('instruction');
    
    // Open YooMoney in new tab
    window.open(yoomoneyURL.toString(), "_blank");
  };
  
  const handleCardPayment = () => {
    if (amount < 100) {
      alert("Минимальная сумма пополнения 100 ₽");
      return;
    }
    
    // Same process as YooMoney but redirecting to card payment
    const generatedPaymentId = `DICE-CARD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setPaymentId(generatedPaymentId);
    
    localStorage.setItem(`payment_${generatedPaymentId}`, JSON.stringify({
      amount,
      status: 'pending',
      timestamp: Date.now()
    }));
    
    // Show instruction
    setPaymentStep('instruction');
    
    // In real system, redirect to acquiring
    window.open(`https://yoomoney.ru/checkout/payments/v2/contract?orderId=${generatedPaymentId}`, "_blank");
  };

  const handleCryptoPayment = (cryptoType: string) => {
    if (amount < 100) {
      alert("Минимальная сумма пополнения 100 ₽");
      return;
    }
    
    const generatedPaymentId = `DICE-CRYPTO-${cryptoType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setPaymentId(generatedPaymentId);
    
    localStorage.setItem(`payment_${generatedPaymentId}`, JSON.stringify({
      amount,
      status: 'pending',
      cryptoType,
      timestamp: Date.now()
    }));
    
    // Show instruction
    setPaymentStep('instruction');
    
    // In real system, redirect to crypto payment gateway
    window.open(`https://connect.yoomoney.ru/crypto-gateway?orderId=${generatedPaymentId}`, "_blank");
  };

  const handleCloseAndReset = () => {
    setPaymentStep('form');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseAndReset}>
      <DialogContent className="bg-[#1A1F2C] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Пополнение баланса</DialogTitle>
        </DialogHeader>
        
        {paymentStep === 'instruction' ? (
          <div className="py-4 space-y-4">
            <Alert className="bg-blue-900 border-blue-700">
              <AlertDescription>
                <p className="font-medium">Инструкция по оплате:</p>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                  <li>Вы будете перенаправлены на страницу оплаты</li>
                  <li>Завершите оплату, следуя инструкциям</li>
                  <li>После успешной оплаты вы будете перенаправлены обратно</li>
                  <li>Ваш баланс будет пополнен автоматически</li>
                </ol>
              </AlertDescription>
            </Alert>
            
            <div className="bg-[#111] p-4 rounded-lg">
              <p className="text-sm font-medium">Детали платежа:</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-gray-400">ID платежа:</span> {paymentId}</p>
                <p><span className="text-gray-400">Сумма:</span> {amount} ₽</p>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              <p>Если у вас возникли проблемы с оплатой, обратитесь в службу поддержки</p>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setPaymentStep('form')}>
                Назад
              </Button>
              <Button onClick={handleCloseAndReset}>
                Закрыть
              </Button>
            </div>
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
                <p className="text-sm">Информация о платеже:</p>
                <p className="text-xs text-gray-400 mt-2">
                  Вы будете перенаправлены на страницу ЮMoney для совершения платежа.
                  После успешной оплаты средства поступят на ваш счет автоматически.
                </p>
              </div>
              
              <Button 
                onClick={handleYooMoneyRedirect} 
                className="w-full bg-purple-700 hover:bg-purple-800"
              >
                Перейти к оплате
              </Button>
            </TabsContent>
            
            <TabsContent value="card" className="space-y-4 mt-4">
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
                <p className="text-sm">Информация о платеже:</p>
                <p className="text-xs text-gray-400 mt-2">
                  Вы будете перенаправлены на защищенную страницу оплаты банковской картой.
                  Поддерживаются карты Visa, MasterCard, МИР.
                </p>
              </div>
              
              <Button 
                onClick={handleCardPayment} 
                className="w-full bg-purple-700 hover:bg-purple-800"
              >
                Перейти к оплате картой
              </Button>
            </TabsContent>
            
            <TabsContent value="crypto" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="crypto-amount">Сумма (₽)</Label>
                <Input
                  id="crypto-amount"
                  type="number"
                  min={100}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-[#333] mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Сумма будет конвертирована в выбранную криптовалюту по текущему курсу
                </p>
              </div>
              
              <p className="text-center py-2">Выберите криптовалюту для оплаты</p>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex justify-center items-center h-20"
                  onClick={() => handleCryptoPayment('bitcoin')}
                >
                  <div className="text-center">
                    <span className="text-xl">₿</span>
                    <p className="text-sm mt-1">Bitcoin</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex justify-center items-center h-20"
                  onClick={() => handleCryptoPayment('ethereum')}
                >
                  <div className="text-center">
                    <span className="text-xl">Ξ</span>
                    <p className="text-sm mt-1">Ethereum</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex justify-center items-center h-20"
                  onClick={() => handleCryptoPayment('usdt')}
                >
                  <div className="text-center">
                    <span className="text-xl">Ƀ</span>
                    <p className="text-sm mt-1">USDT</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex justify-center items-center h-20"
                  onClick={() => handleCryptoPayment('dogecoin')}
                >
                  <div className="text-center">
                    <span className="text-xl">Ð</span>
                    <p className="text-sm mt-1">Dogecoin</p>
                  </div>
                </Button>
              </div>
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
