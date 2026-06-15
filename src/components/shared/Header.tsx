import { useTheme } from '@/hooks/useTheme';
import { Clock, Moon, Sun, TrendingUp, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Divider } from './Divider';

export function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-(--border) border-b px-6 py-3">
      <nav className=" flex items-center justify-between">
        {/* Logo */}
        <a href="/">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
              <Wallet size={20} className="text-primary-foreground" />
            </div>
            <span className="text-lg">
              <span className="text-muted-foreground font-medium">Finanças</span>
              <span className="font-extrabold">.AI</span>
            </span>
          </div>
        </a>
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button variant="secondary" icon={TrendingUp} onClick={() => void navigate('/')}>
            <span className="hidden sm:inline">Nova Simulação</span>
          </Button>
          <Button variant="ghost" icon={Clock} onClick={() => void navigate('/historico')}>
            <span className="hidden sm:inline">Histórico de Simulações</span>
          </Button>
          <Divider orientation="vertical" />
          <Button
            aria-label={`Mudar para tema ${theme === 'light' ? 'dark' : 'light'}`}
            variant="ghost"
            icon={theme === 'light' ? Moon : Sun}
            onClick={toggleTheme}
          />
        </div>
      </nav>
    </header>
  );
}
