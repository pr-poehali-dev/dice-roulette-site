
import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: { email: string; isAdmin: boolean }) => void;
}

// Мок базы данных пользователей для демонстрации
const USERS_DB = [
  { email: "admin@dice.com", password: "admin123", isAdmin: true },
  { email: "user@example.com", password: "user123", isAdmin: false },
];

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    setError("");
    setIsProcessing(true);

    // Имитация проверки учетных данных
    setTimeout(() => {
      setIsProcessing(false);
      
      const user = USERS_DB.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        // Успешный вход
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("isAdmin", user.isAdmin.toString());
        onLogin({ email: user.email, isAdmin: user.isAdmin });
        onClose();
      } else {
        setError("Неверный email или пароль");
      }
    }, 1000);
  };

  const handleRegister = () => {
    if (!registerEmail.trim() || !registerPassword.trim() || !confirmPassword.trim()) {
      setError("Заполните все поля");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (USERS_DB.some((u) => u.email.toLowerCase() === registerEmail.toLowerCase())) {
      setError("Пользователь с таким email уже существует");
      return;
    }

    setError("");
    setIsProcessing(true);

    // Имитация регистрации
    setTimeout(() => {
      setIsProcessing(false);
      
      // В реальном приложении здесь был бы запрос к API для создания пользователя
      USERS_DB.push({ 
        email: registerEmail, 
        password: registerPassword, 
        isAdmin: false 
      });
      
      // Автоматический вход после регистрации
      localStorage.setItem("userEmail", registerEmail);
      localStorage.setItem("isAdmin", "false");
      onLogin({ email: registerEmail, isAdmin: false });
      onClose();
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "login") {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");
    setError("");
    setActiveTab("login");
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1A1F2C] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Вход в аккаунт
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isProcessing}
              >
                {isProcessing ? "Проверка..." : "Войти"}
              </Button>
              
              <div className="text-xs text-gray-400 text-center mt-4">
                <p>Для демонстрации:</p>
                <p>Admin: admin@dice.com / admin123</p>
                <p>User: user@example.com / user123</p>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#333] mt-1"
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                {isProcessing ? "Обработка..." : "Зарегистрироваться"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Отмена
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
