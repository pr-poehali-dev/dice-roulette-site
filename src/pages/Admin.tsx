
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CasinoHeader } from "@/components/CasinoHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Интерфейс для промокода
interface PromoCode {
  id: string;
  code: string;
  type: "bonus" | "balance";
  amount: number;
  wagerMultiplier: number;
  usageLimit: number;
  usageCount: number;
  createdAt: Date;
}

// Интерфейс для транзакции
interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "game" | "bonus";
  amount: number;
  status: "pending" | "completed" | "failed";
  email: string;
  createdAt: Date;
  details?: string;
}

// Мок данных для демонстрации
const initialPromoCodes: PromoCode[] = [
  {
    id: "promo1",
    code: "WELCOME2025",
    type: "bonus",
    amount: 1500,
    wagerMultiplier: 20,
    usageLimit: 1000,
    usageCount: 152,
    createdAt: new Date(2025, 0, 1)
  },
  {
    id: "promo2",
    code: "DICE100",
    type: "balance",
    amount: 100,
    wagerMultiplier: 0,
    usageLimit: 500,
    usageCount: 211,
    createdAt: new Date(2025, 1, 15)
  },
  {
    id: "promo3",
    code: "FREESPIN",
    type: "bonus",
    amount: 500,
    wagerMultiplier: 15,
    usageLimit: 300,
    usageCount: 89,
    createdAt: new Date(2025, 2, 10)
  }
];

const initialTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "deposit",
    amount: 1500,
    status: "completed",
    email: "user@example.com",
    createdAt: new Date(2025, 3, 20),
    details: "ЮMoney: 4100116342286505"
  },
  {
    id: "tx2",
    type: "game",
    amount: -500,
    status: "completed",
    email: "user@example.com",
    createdAt: new Date(2025, 3, 20),
    details: "Dice: Ставка 500, шанс 50%"
  },
  {
    id: "tx3",
    type: "game",
    amount: 1200,
    status: "completed",
    email: "user@example.com",
    createdAt: new Date(2025, 3, 20),
    details: "Dice: Выигрыш x2.4"
  },
  {
    id: "tx4",
    type: "withdraw",
    amount: -1000,
    status: "pending",
    email: "user@example.com",
    createdAt: new Date(2025, 3, 21),
    details: "Карта: **** **** **** 1234"
  },
  {
    id: "tx5",
    type: "bonus",
    amount: 1500,
    status: "completed",
    email: "admin@dice.com",
    createdAt: new Date(2025, 3, 19),
    details: "Промокод: WELCOME2025"
  }
];

// Статистические данные
const statsData = {
  totalUsers: 1248,
  activeUsers: 423,
  totalDeposits: 2895120,
  totalWithdrawals: 1542800,
  profitToday: 98750,
  profitWeek: 325400,
  profitMonth: 1352300,
  gameCount: 15240
};

const Admin = () => {
  const navigate = useNavigate();
  
  // Состояния
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    type: "bonus",
    amount: 100,
    wagerMultiplier: 10,
    usageLimit: 100
  });
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Проверяем права администратора при загрузке
  useEffect(() => {
    const isAdminUser = localStorage.getItem("isAdmin") === "true";
    const email = localStorage.getItem("userEmail");
    
    setIsAdmin(isAdminUser);
    
    if (email) {
      setUserEmail(email);
    }
    
    // Если не админ, перенаправляем на главную
    if (!isAdminUser) {
      navigate("/");
    }
  }, [navigate]);

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  // Создание нового промокода
  const handleCreatePromoCode = () => {
    if (!newPromoCode.code.trim()) {
      setPromoError("Введите код промокода");
      return;
    }

    if (newPromoCode.amount <= 0) {
      setPromoError("Сумма должна быть больше 0");
      return;
    }

    // Проверяем уникальность кода
    if (promoCodes.some(promo => promo.code === newPromoCode.code.toUpperCase())) {
      setPromoError("Промокод с таким кодом уже существует");
      return;
    }

    // Создаем новый промокод
    const newPromo: PromoCode = {
      id: `promo${Date.now()}`,
      code: newPromoCode.code.toUpperCase(),
      type: newPromoCode.type as "bonus" | "balance",
      amount: newPromoCode.amount,
      wagerMultiplier: newPromoCode.type === "bonus" ? newPromoCode.wagerMultiplier : 0,
      usageLimit: newPromoCode.usageLimit,
      usageCount: 0,
      createdAt: new Date()
    };

    // Добавляем в список
    setPromoCodes([newPromo, ...promoCodes]);
    
    // Сбрасываем форму и показываем сообщение об успехе
    setNewPromoCode({
      code: "",
      type: "bonus",
      amount: 100,
      wagerMultiplier: 10,
      usageLimit: 100
    });
    setPromoError("");
    setPromoSuccess(`Промокод ${newPromo.code} успешно создан!`);
    
    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
      setPromoSuccess("");
    }, 3000);
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <CasinoHeader 
        balance={0}
        bonusBalance={0}
        onDepositClick={() => {}}
        onWithdrawClick={() => {}}
        onPromoClick={() => {}}
        onLoginClick={() => {}}
        isLoggedIn={true}
        userEmail={userEmail}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Панель администратора</h1>
          <div className="text-sm text-gray-400">
            <span className="mr-2">🟢 Online:</span>
            <span className="font-medium">{statsData.activeUsers} пользователей</span>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Статистика</TabsTrigger>
            <TabsTrigger value="promocodes">Промокоды</TabsTrigger>
            <TabsTrigger value="transactions">Транзакции</TabsTrigger>
          </TabsList>
          
          {/* Вкладка со статистикой */}
          <TabsContent value="dashboard">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-[#222] border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription>Всего пользователей</CardDescription>
                  <CardTitle className="text-2xl">{statsData.totalUsers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">
                    Активных: {statsData.activeUsers} ({Math.round(statsData.activeUsers / statsData.totalUsers * 100)}%)
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#222] border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription>Общий депозит</CardDescription>
                  <CardTitle className="text-2xl">{statsData.totalDeposits.toLocaleString()} ₽</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">
                    Выводов: {statsData.totalWithdrawals.toLocaleString()} ₽
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#222] border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription>Профит за сегодня</CardDescription>
                  <CardTitle className="text-2xl text-green-500">+{statsData.profitToday.toLocaleString()} ₽</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">
                    За неделю: {statsData.profitWeek.toLocaleString()} ₽
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#222] border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription>Всего игр</CardDescription>
                  <CardTitle className="text-2xl">{statsData.gameCount.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">
                    Профит в месяц: {statsData.profitMonth.toLocaleString()} ₽
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Последние транзакции</h2>
              <div className="bg-[#222] rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 5).map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                        <TableCell>
                          {tx.type === "deposit" && <span className="text-green-500">Депозит</span>}
                          {tx.type === "withdraw" && <span className="text-red-500">Вывод</span>}
                          {tx.type === "game" && <span className="text-blue-500">Игра</span>}
                          {tx.type === "bonus" && <span className="text-purple-500">Бонус</span>}
                        </TableCell>
                        <TableCell className={tx.amount > 0 ? "text-green-500" : "text-red-500"}>
                          {tx.amount > 0 ? "+" : ""}{tx.amount} ₽
                        </TableCell>
                        <TableCell>{tx.email}</TableCell>
                        <TableCell>
                          {tx.status === "completed" && <span className="text-green-500">Выполнен</span>}
                          {tx.status === "pending" && <span className="text-yellow-500">В обработке</span>}
                          {tx.status === "failed" && <span className="text-red-500">Ошибка</span>}
                        </TableCell>
                        <TableCell>{formatDate(tx.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          {/* Вкладка с промокодами */}
          <TabsContent value="promocodes">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-[#222] border-gray-700">
                <CardHeader>
                  <CardTitle>Создать промокод</CardTitle>
                  <CardDescription>
                    Создайте новый промокод для пользователей
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {promoError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{promoError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {promoSuccess && (
                    <Alert className="mb-4 bg-green-900 border-green-700">
                      <AlertDescription>{promoSuccess}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="promo-code">Код промокода</Label>
                      <Input
                        id="promo-code"
                        placeholder="SUMMER2025"
                        value={newPromoCode.code}
                        onChange={(e) => setNewPromoCode({...newPromoCode, code: e.target.value})}
                        className="bg-[#333] mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="promo-type">Тип</Label>
                      <Select 
                        value={newPromoCode.type} 
                        onValueChange={(value) => setNewPromoCode({...newPromoCode, type: value})}
                      >
                        <SelectTrigger className="w-full bg-[#333] mt-1">
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bonus">Бонусный баланс</SelectItem>
                          <SelectItem value="balance">Основной баланс</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="promo-amount">Сумма (₽)</Label>
                      <Input
                        id="promo-amount"
                        type="number"
                        min="1"
                        placeholder="100"
                        value={newPromoCode.amount}
                        onChange={(e) => setNewPromoCode({...newPromoCode, amount: Number(e.target.value)})}
                        className="bg-[#333] mt-1"
                      />
                    </div>
                    
                    {newPromoCode.type === "bonus" && (
                      <div>
                        <Label htmlFor="promo-wager">Вейджер (х)</Label>
                        <Input
                          id="promo-wager"
                          type="number"
                          min="0"
                          placeholder="20"
                          value={newPromoCode.wagerMultiplier}
                          onChange={(e) => setNewPromoCode({...newPromoCode, wagerMultiplier: Number(e.target.value)})}
                          className="bg-[#333] mt-1"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="promo-limit">Лимит использований</Label>
                      <Input
                        id="promo-limit"
                        type="number"
                        min="1"
                        placeholder="100"
                        value={newPromoCode.usageLimit}
                        onChange={(e) => setNewPromoCode({...newPromoCode, usageLimit: Number(e.target.value)})}
                        className="bg-[#333] mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCreatePromoCode}
                    className="w-full bg-purple-700 hover:bg-purple-800"
                  >
                    Создать промокод
                  </Button>
                </CardFooter>
              </Card>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Активные промокоды</h2>
                <div className="bg-[#222] rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Код</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Использовано</TableHead>
                        <TableHead>Создан</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promoCodes.map((promo) => (
                        <TableRow key={promo.id}>
                          <TableCell className="font-medium">{promo.code}</TableCell>
                          <TableCell>
                            {promo.type === "bonus" ? (
                              <span className="text-purple-400">Бонус</span>
                            ) : (
                              <span className="text-green-500">Баланс</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {promo.amount} ₽
                            {promo.type === "bonus" && promo.wagerMultiplier > 0 && (
                              <span className="text-xs text-gray-400"> (x{promo.wagerMultiplier})</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={promo.usageCount >= promo.usageLimit ? "text-red-500" : "text-gray-300"}>
                              {promo.usageCount} / {promo.usageLimit}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(promo.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Вкладка с транзакциями */}
          <TabsContent value="transactions">
            <div className="bg-[#222] rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Детали</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                      <TableCell>
                        {tx.type === "deposit" && <span className="text-green-500">Депозит</span>}
                        {tx.type === "withdraw" && <span className="text-red-500">Вывод</span>}
                        {tx.type === "game" && <span className="text-blue-500">Игра</span>}
                        {tx.type === "bonus" && <span className="text-purple-500">Бонус</span>}
                      </TableCell>
                      <TableCell className={tx.amount > 0 ? "text-green-500" : "text-red-500"}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount} ₽
                      </TableCell>
                      <TableCell>{tx.email}</TableCell>
                      <TableCell>
                        {tx.status === "completed" && <span className="text-green-500">Выполнен</span>}
                        {tx.status === "pending" && <span className="text-yellow-500">В обработке</span>}
                        {tx.status === "failed" && <span className="text-red-500">Ошибка</span>}
                      </TableCell>
                      <TableCell>{formatDate(tx.createdAt)}</TableCell>
                      <TableCell className="text-xs text-gray-400">{tx.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-[#222] py-6 text-center text-sm text-gray-400">
        <div className="container mx-auto">
          <p>© 2025 Dice Casino. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
