import React, { useState } from 'react';
import { Button } from '../ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export function LogoutButton({ 
  variant = 'outline', 
  size = 'sm', 
  showText = true,
  className = ''
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Si estamos en el contexto de Next.js con NextAuth
      if (typeof window !== 'undefined' && (window as any).next) {
        const { signOut } = await import('next-auth/react');
        await signOut({ 
          callbackUrl: '/login',
          redirect: true 
        });
      } else {
        // Fallback para el contexto de React (desarrollo)
        // Limpiar localStorage/sessionStorage
        localStorage.removeItem('auth-token');
        sessionStorage.removeItem('auth-token');
        
        // Redirigir al login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // En caso de error, forzar redirección
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={className}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          {showText && (
            <span className="ml-2">
              {isLoading ? 'Cerrando...' : 'Cerrar Sesión'}
            </span>
          )}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder a tu cuenta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Cerrando...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}