
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [paymentInfo, setPaymentInfo] = useState<{
    amount: number;
    id: string;
  } | null>(null);

  useEffect(() => {
    // Get payment information from URL parameters
    const label = searchParams.get('label');
    
    if (!label) {
      setStatus('error');
      return;
    }
    
    // In a real application, you would verify the payment with the YooMoney API
    // Here we're simulating the verification using localStorage
    const paymentData = localStorage.getItem(`payment_${label}`);
    
    if (!paymentData) {
      setStatus('error');
      return;
    }
    
    try {
      const paymentDetails = JSON.parse(paymentData);
      
      // Check if this payment was already processed
      if (paymentDetails.status === 'completed') {
        setStatus('error');
        return;
      }
      
      // In a real application, you would verify the payment with the payment provider
      // and update the user's balance in your database
      
      // Simulate successful payment
      const userBalance = localStorage.getItem('userBalance') || '0';
      const newBalance = parseFloat(userBalance) + paymentDetails.amount;
      localStorage.setItem('userBalance', newBalance.toString());
      
      // Mark payment as completed
      paymentDetails.status = 'completed';
      localStorage.setItem(`payment_${label}`, JSON.stringify(paymentDetails));
      
      setPaymentInfo({
        amount: paymentDetails.amount,
        id: label
      });
      
      setStatus('success');
      
      // Notify the main application about the balance update
      window.dispatchEvent(new CustomEvent('balanceUpdated', { 
        detail: { newBalance }
      }));
      
    } catch (error) {
      console.error('Error processing payment:', error);
      setStatus('error');
    }
  }, [searchParams]);
  
  const handleReturn = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex flex-col items-center justify-center">
      <div className="bg-[#252A3C] p-8 rounded-xl shadow-xl max-w-md w-full">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <h2 className="text-xl font-bold mt-6">Обработка платежа</h2>
              <p className="mt-2 text-gray-400">Пожалуйста, подождите...</p>
            </>
          )}
          
          {status === 'success' && paymentInfo && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
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
              <h2 className="text-xl font-bold mt-6">Оплата успешна!</h2>
              <p className="mt-2 text-gray-400">
                Ваш баланс пополнен на {paymentInfo.amount} ₽
              </p>
              <div className="mt-4 p-3 bg-[#1A1F2C] rounded-lg text-left">
                <p className="text-sm"><span className="text-gray-400">ID платежа:</span> {paymentInfo.id}</p>
                <p className="text-sm"><span className="text-gray-400">Сумма:</span> {paymentInfo.amount} ₽</p>
                <p className="text-sm"><span className="text-gray-400">Дата:</span> {new Date().toLocaleString()}</p>
              </div>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
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
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mt-6">Ошибка платежа</h2>
              <p className="mt-2 text-gray-400">
                Что-то пошло не так при обработке вашего платежа. 
                Пожалуйста, попробуйте еще раз или обратитесь в службу поддержки.
              </p>
            </>
          )}
          
          <div className="mt-8">
            <Button 
              onClick={handleReturn} 
              className="bg-purple-700 hover:bg-purple-800 w-full"
            >
              Вернуться в казино
            </Button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500">
        Если у вас возникли проблемы с платежом, <br />
        пожалуйста, обратитесь в службу поддержки: support@dicecasino.ru
      </p>
    </div>
  );
};

export default PaymentCallback;
