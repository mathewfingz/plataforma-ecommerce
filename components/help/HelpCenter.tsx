import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Video, 
  FileText,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Users,
  Settings,
  ShoppingCart,
  BarChart3,
  HelpCircle,
  Mail,
  Phone
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin' | 'staff';
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  views: number;
  helpful: number;
  content: string;
  tags: string[];
}

interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  articleCount: number;
  color: string;
}

interface HelpCenterProps {
  user: User;
}

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    name: 'Primeros Pasos',
    description: 'Guías básicas para comenzar',
    icon: Lightbulb,
    articleCount: 12,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
  },
  {
    id: 'products',
    name: 'Gestión de Productos',
    description: 'Crear y gestionar tu catálogo',
    icon: ShoppingCart,
    articleCount: 18,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200'
  },
  {
    id: 'analytics',
    name: 'Análisis y Reportes',
    description: 'Interpretar métricas y datos',
    icon: BarChart3,
    articleCount: 9,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200'
  },
  {
    id: 'settings',
    name: 'Configuración',
    description: 'Ajustes de cuenta y tienda',
    icon: Settings,
    articleCount: 15,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200'
  },
  {
    id: 'integrations',
    name: 'Integraciones',
    description: 'Conectar servicios externos',
    icon: Users,
    articleCount: 7,
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
  }
];

const popularArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'Cómo importar productos desde CSV',
    description: 'Guía paso a paso para importar tu catálogo',
    category: 'products',
    views: 1250,
    helpful: 89,
    content: 'Contenido del artículo...',
    tags: ['importación', 'csv', 'productos']
  },
  {
    id: '2',
    title: 'Configurar comisiones personalizadas',
    description: 'Establecer estructura de comisiones',
    category: 'settings',
    views: 980,
    helpful: 76,
    content: 'Contenido del artículo...',
    tags: ['comisiones', 'configuración']
  },
  {
    id: '3',
    title: 'Conectar con Shopify',
    description: 'Sincronizar tu tienda Shopify',
    category: 'integrations',
    views: 856,
    helpful: 92,
    content: 'Contenido del artículo...',
    tags: ['shopify', 'integración']
  },
  {
    id: '4',
    title: 'Interpretar métricas de rendimiento',
    description: 'Entender KPIs y análisis',
    category: 'analytics',
    views: 672,
    helpful: 68,
    content: 'Contenido del artículo...',
    tags: ['métricas', 'kpi', 'análisis']
  }
];

const faqs = [
  {
    question: '¿Cómo puedo cambiar mi plan de suscripción?',
    answer: 'Puedes cambiar tu plan desde la sección de Configuración > Facturación. Los cambios se aplican inmediatamente y se prorratean según corresponda.'
  },
  {
    question: '¿Hay límites en el número de productos?',
    answer: 'Los límites dependen de tu plan. El plan Básico incluye hasta 1,000 productos, mientras que los planes superiores ofrecen productos ilimitados.'
  },
  {
    question: '¿Cómo funciona la sincronización con Shopify?',
    answer: 'La sincronización es bidireccional y automática. Los productos, pedidos e inventario se mantienen actualizados entre ambas plataformas en tiempo real.'
  },
  {
    question: '¿Puedo exportar mis datos?',
    answer: 'Sí, puedes exportar todos tus datos (productos, pedidos, clientes) en formato CSV desde cualquier sección de la plataforma.'
  },
  {
    question: '¿Qué métodos de pago soportan?',
    answer: 'Aceptamos todas las tarjetas principales a través de Stripe, transferencias bancarias y PayPal para las comisiones.'
  }
];

export function HelpCenter({ user }: HelpCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Centro de Ayuda</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Encuentra respuestas, guías y recursos para aprovechar al máximo tu plataforma
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en la documentación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="browse">Explorar</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contacto</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browse" className="space-y-6">
          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {category.articleCount} artículos
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center text-sm text-primary">
                      <span>Ver artículos</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Popular Articles */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Artículos Populares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                    <CardDescription className="line-clamp-2">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>{article.views} vistas</span>
                        <span>👍 {article.helpful}</span>
                      </div>
                      <div className="flex gap-1">
                        {article.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Enlaces Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Book className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Guía de inicio</p>
                    <p className="text-xs text-muted-foreground">Primeros pasos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Video className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Videos tutoriales</p>
                    <p className="text-xs text-muted-foreground">Aprende viendo</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">API Docs</p>
                    <p className="text-xs text-muted-foreground">Documentación técnica</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Users className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-sm">Comunidad</p>
                    <p className="text-xs text-muted-foreground">Conecta con otros</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Preguntas Frecuentes</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-7">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Contacta con Soporte</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <CardTitle className="text-lg">Chat en Vivo</CardTitle>
                  <CardDescription>
                    Respuesta inmediata de nuestro equipo
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button>
                    Iniciar Chat
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Disponible L-V 9:00-18:00
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <CardTitle className="text-lg">Email</CardTitle>
                  <CardDescription>
                    Para consultas detalladas
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline">
                    soporte@marketplace.com
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Respuesta en 24 horas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Principal</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Operativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sincronización Shopify</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Operativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Procesamiento de Pagos</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Operativo
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="link" className="text-xs">
                    Ver historial completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}