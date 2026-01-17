import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileText, LayoutTemplate, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/blueprints', label: 'Blueprints', icon: LayoutTemplate },
  { to: '/contracts', label: 'Contracts', icon: FileText },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">ContractHub</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to || 
                  (item.to !== '/' && location.pathname.startsWith(item.to));
                
                return (
                  <Button
                    key={item.to}
                    variant={isActive ? 'secondary' : 'ghost'}
                    asChild
                    className={cn(
                      'gap-2',
                      isActive && 'bg-secondary'
                    )}
                  >
                    <Link to={item.to}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      <main className="container py-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
