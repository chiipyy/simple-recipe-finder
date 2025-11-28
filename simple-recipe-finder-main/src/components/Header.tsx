import { Link, useLocation } from 'react-router-dom';
import { ChefHat, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAuthToken, authApi } from '@/lib/api';

const Header = () => {
  const location = useLocation();
  const isAuthenticated = !!getAuthToken();

  const handleLogout = () => {
    authApi.logout();
    window.location.href = '/';
  };

  const navLinks = [
    { to: '/', label: 'Start' },
    { to: '/recipes', label: 'Rezepte' },
    { to: '/ingredients', label: 'Zutaten-Suche' },
    ...(isAuthenticated ? [{ to: '/favorites', label: 'Favoriten' }] : []),
  ];

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-medium">
            <ChefHat className="text-primary" size={28} />
            <span>KochHilfe</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors hover:text-primary ${
                  location.pathname === link.to ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Abmelden
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">Anmelden</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-4 mt-4 overflow-x-auto pb-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm whitespace-nowrap transition-colors hover:text-primary ${
                location.pathname === link.to ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
