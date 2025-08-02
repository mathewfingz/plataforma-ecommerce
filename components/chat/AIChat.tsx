import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  TrendingUp, 
  Search, 
  ShoppingBag,
  MessageSquare
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin';
  shopifyConnected?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'analysis';
}

interface AIChatProps {
  user: User;
}

const QUICK_SUGGESTIONS = [
  {
    id: '1',
    text: '¿Cómo optimizar mi SEO?',
    icon: Search,
    category: 'SEO'
  },
  {
    id: '2',
    text: 'Analizar mis ventas',
    icon: TrendingUp,
    category: 'Analytics'
  },
  {
    id: '3',
    text: 'Mejorar descripción de productos',
    icon: ShoppingBag,
    category: 'Productos'
  },
  {
    id: '4',
    text: 'Estrategias de marketing',
    icon: Lightbulb,
    category: 'Marketing'
  }
];

const AI_RESPONSES = {
  seo: `¡Excelente pregunta! Aquí tienes algunas estrategias clave para optimizar tu SEO:

🔍 **Palabras clave:**
- Investiga palabras clave relevantes para tus productos
- Usa herramientas como Google Keyword Planner
- Incluye palabras clave en títulos y descripciones

📝 **Contenido de calidad:**
- Escribe descripciones únicas y detalladas
- Usa bullet points para destacar características
- Incluye información técnica relevante

🖼️ **Optimización de imágenes:**
- Usa nombres descriptivos para archivos
- Añade texto alternativo (alt text)
- Optimiza el tamaño para velocidad de carga

¿Te gustaría que profundice en algún aspecto específico?`,

  ventas: `📊 **Análisis de tus ventas actuales:**

**Rendimiento general:**
- Ventas totales: €29,700 (↑12.5%)
- Pedidos: 190 (↑8.2%)
- Valor promedio: €156.32 (↓2.1%)

**Top productos:**
1. Smartphone XYZ - €1,200 en ventas
2. Auriculares Bluetooth - €800 en ventas
3. Camiseta Vintage - €650 en ventas

**Recomendaciones:**
🎯 Enfócate en productos de electrónicos (mejor margen)
📈 Aumenta el valor promedio con bundles
🔄 Restock productos sin inventario

¿Quieres que analice alguna categoría específica?`,

  productos: `✍️ **Tips para mejorar tus descripciones de productos:**

**Estructura recomendada:**
1. **Título atractivo** con palabra clave principal
2. **Beneficios clave** en los primeros 3 bullets
3. **Especificaciones técnicas** organizadas
4. **Casos de uso** específicos

**Ejemplo optimizado:**
❌ "Auriculares buenos"
✅ "Auriculares Bluetooth Pro - Cancelación Ruido Activa 30h Batería"

**Elementos clave:**
- Usa números específicos (30h, 50% descuento)
- Incluye emociones (confort, libertad, calidad)
- Menciona garantías y envío
- Añade urgencia cuando sea apropiado

¿Quieres que revise algún producto específico?`,

  marketing: `🚀 **Estrategias de marketing efectivas para tu tienda:**

**Marketing de contenido:**
- Blog con guías de uso de productos
- Videos de unboxing y reviews
- Tutoriales paso a paso

**Redes sociales:**
- Instagram: Fotos lifestyle de productos
- TikTok: Videos cortos de demostraciones
- LinkedIn: Contenido B2B si aplica

**Email marketing:**
- Carrito abandonado (conversión ~15%)
- Newsletter semanal con ofertas
- Follow-up post-compra

**Colaboraciones:**
- Influencers micro (1K-100K seguidores)
- Intercambio con tiendas complementarias
- Programa de afiliados

¿Te interesa profundizar en alguna estrategia específica?`
};

export function AIChat({ user }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `¡Hola ${user.name}! 👋 Soy tu asistente de IA especializado en e-commerce. Estoy aquí para ayudarte con:\n\n• Optimización SEO\n• Análisis de ventas\n• Estrategias de marketing\n• Mejora de productos\n• Soporte técnico\n\n¿En qué puedo ayudarte hoy?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('seo') || lowerMessage.includes('optimizar') || lowerMessage.includes('búsqueda')) {
      return AI_RESPONSES.seo;
    } else if (lowerMessage.includes('ventas') || lowerMessage.includes('analizar') || lowerMessage.includes('rendimiento')) {
      return AI_RESPONSES.ventas;
    } else if (lowerMessage.includes('producto') || lowerMessage.includes('descripción') || lowerMessage.includes('mejorar')) {
      return AI_RESPONSES.productos;
    } else if (lowerMessage.includes('marketing') || lowerMessage.includes('promoción') || lowerMessage.includes('estrategia')) {
      return AI_RESPONSES.marketing;
    } else {
      return `Entiendo tu consulta sobre "${message}". Como asistente especializado en e-commerce, te puedo ayudar con:

• **SEO y optimización** - Para mejorar tu visibilidad
• **Análisis de ventas** - Para identificar oportunidades  
• **Marketing digital** - Para aumentar tus conversiones
• **Gestión de productos** - Para optimizar tu catálogo

¿Sobre cuál de estos temas te gustaría que profundice?`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular delay de respuesta de IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickSuggestion = (suggestion: typeof QUICK_SUGGESTIONS[0]) => {
    setInputMessage(suggestion.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Asistente IA</h1>
          <p className="text-muted-foreground">
            Tu asistente inteligente para optimizar tu negocio
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <Bot className="h-3 w-3 mr-1" />
          GPT-4o Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sugerencias rápidas */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sugerencias Rápidas</CardTitle>
              <CardDescription className="text-sm">
                Preguntas frecuentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {QUICK_SUGGESTIONS.map((suggestion) => {
                const Icon = suggestion.icon;
                return (
                  <Button
                    key={suggestion.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => handleQuickSuggestion(suggestion)}
                  >
                    <div className="flex items-start space-x-2">
                      <Icon className="h-4 w-4 mt-0.5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{suggestion.text}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Chat principal */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat con IA
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'ai' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      {message.sender === 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <Separator />
              
              <div className="p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}