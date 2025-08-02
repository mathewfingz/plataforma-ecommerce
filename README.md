# SaaS Multi-Tienda Dashboard - Frontend Mock

Una hermosa y completamente funcional plataforma frontend-only SaaS multi-tienda construida con React, TypeScript, y Tailwind CSS. Esta versión usa datos simulados para propósitos de demostración.

## 🚀 Demo en Vivo

**[Ver Demo en Vivo](https://griffe3-n9l5bxog2-mateotarape-gmailcoms-projects.vercel.app)**

## ✨ Características

- **UI/UX Moderno**: Diseño hermoso y responsive con modo oscuro/claro
- **Panel Tienda**: Gestión de productos, seguimiento de pedidos, analíticas
- **Panel Admin**: Gestión de usuarios, analíticas del sistema
- **Sistema CRM**: Gestión de relaciones con clientes
- **Hub Marketing**: Herramientas de gestión de campañas
- **Panel Analíticas**: Insights de negocio y métricas
- **Centro Ayuda**: Documentación de soporte
- **Autenticación Simulada**: Funcionalidad de login demo
- **Diseño Responsive**: Funciona en todos los dispositivos

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form, Zod validation
- **Data**: Mock API service (no backend required)

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "NEw design"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Demo Credentials

Use these credentials to test the mock authentication:

- **Vendor Account**: 
  - Email: `demo@vendor.com`
  - Password: `demo123`

- **Admin Account**:
  - Email: `admin@platform.com`
  - Password: `admin123`

## 📁 Project Structure

```
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── analytics/      # Analytics components
│   ├── auth/           # Authentication components
│   ├── crm/            # CRM components
│   ├── vendor/         # Vendor dashboard components
│   └── ui/             # Reusable UI components
├── src/
│   ├── services/       # API services (mock)
│   ├── contexts/       # React contexts
│   └── types/          # TypeScript types
├── styles/             # Global styles
└── dist/               # Build output
```

## 🎨 Features Showcase

### Dashboard Views
- **Vendor Dashboard**: Product management, sales analytics, order tracking
- **Admin Panel**: User management, system overview, platform analytics
- **CRM Dashboard**: Customer management, communication tools
- **Marketing Hub**: Campaign creation, email marketing, social media

### UI Components
- **Modern Design**: Clean, professional interface
- **Dark/Light Mode**: Theme switching capability
- **Responsive Layout**: Mobile-first design
- **Interactive Charts**: Beautiful data visualizations
- **Form Validation**: Comprehensive form handling

## 🚀 Deployment

This project is configured for easy deployment on Vercel:

1. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

2. **Or connect your GitHub repository to Vercel for automatic deployments**

## 📝 Notes

- This is a **frontend-only** version using mock data
- No backend or database required
- Perfect for demonstrations, prototyping, or UI showcases
- All data is simulated and resets on page refresh
- Authentication is mock-based (no real security)

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use cases.

## 📄 License

This project is for demonstration purposes.