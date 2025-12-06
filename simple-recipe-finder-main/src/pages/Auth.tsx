import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { authApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

const isStrongPassword = (value: string) => {
  if (value.length < 8) return false;
  if (!/[A-Za-z]/.test(value)) return false;
  if (!/[0-9]/.test(value)) return false;
  return true;
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // gemeinsame Basis-Checks
    if (!email.trim() || !password) {
      toast({
        title: 'Missing information',
        description: 'Please fill in email and password.',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!isStrongPassword(password)) {
      toast({
        title: 'Insecure password',
        description:
          'Password must be at least 8 characters and include letters and numbers.',
        variant: 'destructive',
      });
      return;
    }

    // Zusätzliche Checks nur bei Registrierung
    if (!isLogin) {
      if (!confirmPassword) {
        toast({
          title: 'Missing information',
          description: 'Please repeat your password.',
          variant: 'destructive',
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: 'Passwords do not match',
          description: 'Please enter the same password in both fields.',
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);

    try {
  const result = isLogin
    ? await authApi.login(email, password)
    : await authApi.register(email, password);

  if (result.error) {
    // Fehlermeldung je nach Kontext anpassen
    let message = result.error as string;

    if (isLogin) {
      // typische Login-Fehler „Email oder Passwort falsch“
      message = 'The email or password does not match.';
    } else if (message.toLowerCase().includes('exists')) {
      // z.B. „User already exists“
      message = 'An account with this email already exists.';
    }

    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  } else {
    toast({
      title: 'Successful',
      description: isLogin ? 'You are now logged in' : 'Account created',
    });
    navigate('/');
  }
} catch (error) {
  toast({
    title: 'Error',
    description: 'An unexpected error has occurred',
    variant: 'destructive',
  });
} finally {
  setLoading(false);
}

  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-8">
          <h1 className="text-2xl font-medium mb-6 text-center">
            {isLogin ? 'Sign in' : 'Register'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.de"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters, letters & numbers"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Repeat password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Sign in' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? 'Dont have an account yet? Register now'
                : 'Already registered? Log in now'}
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
