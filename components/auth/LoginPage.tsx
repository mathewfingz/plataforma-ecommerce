import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { ShoppingBag, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { GoogleAuthResponse } from '../../src/services/googleAuth';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login failed:', error);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    clearError();
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    try {
      await login(demoEmail, demoPassword);
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  const handleGoogleSuccess = async (authResponse: GoogleAuthResponse) => {
    try {
      await loginWithGoogle(authResponse);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGoogleError = (error: string) => {
    console.error('Google authentication error:', error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            MarketPlace SaaS
          </CardTitle>
          <CardDescription>
            Inicia sesión en tu cuenta de vendedor
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Demo buttons */}
          <div className="space-y-2">
            <Label className="text-sm">Cuentas de demostración:</Label>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleDemoLogin('tienda@example.com', 'demo123')}
                disabled={isLoading}
              >
                🏪 Entrar como Vendedor
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleDemoLogin('admin@example.com', 'admin123')}
                disabled={isLoading}
              >
                👑 Entrar como Admin
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleDemoLogin('demo@example.com', 'demo123')}
                disabled={isLoading}
              >
                👤 Entrar como Cliente
              </Button>
            </div>
          </div>

          <Separator />

          {/* Google Sign-In */}
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isLoading}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continúa con email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Button variant="link" className="p-0 h-auto" onClick={onSwitchToRegister}>
              Regístrate
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}