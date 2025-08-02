import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useIsMobile } from '../ui/use-mobile';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin' | 'staff';
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface FloatingAIChatProps {
  user: User;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: `¡Hola ${window.localStorage.getItem('saas-user') ? JSON.parse(window.localStorage.getItem('saas-user')!).name || 'Usuario' : 'Usuario'}! 👋 Soy tu asistente de IA. Puedo ayudarte con:`,
    timestamp: new Date().toISOString(),
    suggestions: [
      'Análisis de ventas',
      'Optimizar productos',
      'Campañas de marketing',
      'Gestión de inventario'
    ]
  }
];

export function FloatingAIChat({ user }: FloatingAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const isMobile = useIsMobile();

  // Auto-cerrar chat en mobile cuando cambie de landscape a portrait
  useEffect(() => {
    if (isMobile && isOpen && !isMinimized) {
      const handleResize = () => {
        if (window.innerHeight < 500) {
          setIsMinimized(true);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobile, isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('ventas') || input.includes('análisis')) {
      return '📊 Basado en tus datos, las ventas han aumentado 12% este mes. Te recomiendo promocionar los productos con mayor margen durante las próximas 2 semanas.';
    } else if (input.includes('productos') || input.includes('inventario')) {
      return '📦 Tienes 3 productos con stock bajo. Te sugiero reabastecer "Smartphone XYZ" pronto, ya que es tu producto más vendido.';
    } else if (input.includes('marketing') || input.includes('campaña')) {
      return '🎯 Para tu próxima campaña, te recomiendo dirigirte a clientes VIP con un descuento del 15%. La tasa de conversión suele ser 40% mayor.';
    } else if (input.includes('clientes') || input.includes('crm')) {
      return '👥 Tienes 23 clientes inactivos en los últimos 60 días. ¿Te ayudo a crear una campaña de reactivación?';
    } else {
      return '🤖 Entiendo tu consulta. Como asistente especializado en e-commerce, puedo ayudarte con análisis de ventas, gestión de productos, estrategias de marketing y optimización de tu tienda. ¿En qué área específica te gustaría que te asista?';
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Configuración responsive
  const chatConfig = {
    position: isMobile ? 'fixed inset-4' : 'fixed bottom-6 right-6',
    width: isMobile ? 'w-auto' : 'w-96',
    height: isMinimized ? 'h-16' : (isMobile ? 'h-auto max-h-[90vh]' : 'h-[600px] max-h-[80vh]'),
    buttonSize: isMobile ? 'h-16 w-16' : 'h-14 w-14',
    buttonPosition: isMobile ? 'fixed bottom-4 right-4' : 'fixed bottom-6 right-6'
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`${chatConfig.buttonPosition} z-50`}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className={`${chatConfig.buttonSize} rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 relative`}
              size="icon"
            >
              <MessageCircle className={isMobile ? "h-7 w-7" : "h-6 w-6"} />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            {isMobile && !isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setIsOpen(false)}
              />
            )}
            
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              className={`${chatConfig.position} ${chatConfig.width} ${chatConfig.height} z-50 transition-all duration-300`}
            >
              <Card className="h-full flex flex-col shadow-2xl border-0 bg-background">
                {/* Header */}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-primary-foreground rounded-t-lg flex-shrink-0">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm truncate">Asistente IA</CardTitle>
                      <CardDescription className="text-xs text-primary-foreground/70 truncate">
                        {isMobile ? 'Disponible 24/7' : 'Siempre disponible para ayudarte'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {!isMobile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                        onClick={() => setIsMinimized(!isMinimized)}
                      >
                        {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Chat Content */}
                {!isMinimized && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex-1 flex flex-col min-h-0"
                  >
                    <CardContent className="flex-1 p-0 min-h-0">
                      <ScrollArea className={`${isMobile ? 'h-[300px]' : 'h-[400px]'} p-4`}>
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[85%] rounded-lg p-3 ${
                                  message.type === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <div className="flex items-start space-x-2">
                                  {message.type === 'ai' && (
                                    <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm break-words">{message.content}</p>
                                    <p className={`text-xs mt-1 ${
                                      message.type === 'user' 
                                        ? 'text-primary-foreground/70' 
                                        : 'text-muted-foreground'
                                    }`}>
                                      {formatTime(message.timestamp)}
                                    </p>
                                  </div>
                                  {message.type === 'user' && (
                                    <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  )}
                                </div>
                                
                                {message.suggestions && (
                                  <div className="mt-3 flex flex-wrap gap-1">
                                    {message.suggestions.map((suggestion, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7 text-left"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                      >
                                        <Zap className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">{suggestion}</span>
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                                <div className="flex items-center space-x-2">
                                  <Bot className="h-4 w-4" />
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>

                    {/* Input Area */}
                    <div className="border-t p-4 flex-shrink-0">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Escribe tu mensaje..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-1 min-w-0"
                          disabled={isTyping}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim() || isTyping}
                          size="icon"
                          className="flex-shrink-0"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {isMobile ? 'Toca Enviar' : 'Presiona Enter para enviar'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}