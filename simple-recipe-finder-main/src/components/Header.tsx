import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAuthToken, authApi } from '@/lib/api';

const Header = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!getAuthToken());
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/recipes', label: 'Recipe Search' },
    { to: '/ingredients', label: 'Ingredient Finder' },
    { to: '/random', label: 'Random Recipe' },
    ...(isAuthenticated ? [{ to: '/favorites', label: 'Favoriten' }] : []),
  ];

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-medium">
            <ChefHat className="text-primary" size={28} />
            <span>Find your Recipe</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors hover:text-primary ${
                  location.pathname === link.to
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
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
                Log out
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">Log in / Register</Link>
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
                location.pathname === link.to
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
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
