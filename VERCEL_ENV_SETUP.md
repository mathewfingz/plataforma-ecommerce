# Configuración de Variables de Entorno en Vercel

## 🚀 Deployment Exitoso

Tu aplicación ha sido desplegada exitosamente en Vercel:

**URL de Producción:** https://web-nnpgm2urk-mateotarape-gmailcoms-projects.vercel.app

## ⚙️ Configuración Requerida

Para que la aplicación funcione completamente, necesitas configurar las siguientes variables de entorno en el dashboard de Vercel:

### 1. Acceder al Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta
3. Busca el proyecto "web"
4. Ve a **Settings** → **Environment Variables**

### 2. Variables de Entorno Requeridas

Agrega las siguientes variables:

#### NextAuth Configuration
```
NEXTAUTH_URL = https://web-nnpgm2urk-mateotarape-gmailcoms-projects.vercel.app
NEXTAUTH_SECRET = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NODE_ENV = production
```

#### Base de Datos (Opcional - para funcionalidad completa)
```
DATABASE_URL = postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
DIRECT_URL = postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 3. Configurar Base de Datos Neon (Opcional)

Si quieres usar una base de datos real en lugar de los datos mock:

1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia las connection strings
5. Reemplaza las URLs en las variables de entorno de Vercel

### 4. Redeployment

Después de configurar las variables de entorno:

1. Ve a la pestaña **Deployments** en Vercel
2. Haz clic en **Redeploy** en el último deployment
3. Espera a que se complete el proceso

## 🎯 Estado Actual

### ✅ Funcionalidades Desplegadas

- **Dashboard de Admin** con tabs organizados
- **Panel de Productos** con filtros y gestión completa
- **Panel de Envíos** con subida de guías y notificaciones
- **Sistema de Autenticación** con NextAuth
- **Dashboards de Tienda** con todas las funcionalidades
- **UI Responsiva** con Tailwind CSS y componentes Radix UI

### 🔧 Configuración Actual

- **Framework:** Next.js 15.4.5
- **Autenticación:** NextAuth con usuarios mock
- **Base de Datos:** Prisma (configurado para Neon)
- **UI:** Tailwind CSS + Radix UI + Framer Motion
- **Deployment:** Vercel con build optimizado

## 📱 Acceso a la Aplicación

### Usuarios de Prueba (Mock Data)

**Admin:**
- Email: admin@admin.com
- Password: admin123

**Tienda:**
- Email: tienda@tienda.com
- Password: tienda123

### URLs Principales

- **Home:** https://web-nnpgm2urk-mateotarape-gmailcoms-projects.vercel.app
- **Login:** https://web-nnpgm2urk-mateotarape-gmailcoms-projects.vercel.app/login
- **Dashboard Admin:** https://web-nnpgm2urk-mateotarape-gmailcoms-projects.vercel.app/dashboard/admin
- **Dashboard Tienda:** https://web-nnpgm2urk-mateotarape-gmailcoms-projects.vercel.app/dashboard/tienda

## 🛠️ Próximos Pasos

1. **Configurar variables de entorno** en Vercel
2. **Configurar base de datos Neon** (opcional)
3. **Personalizar dominio** (opcional)
4. **Configurar analytics** (opcional)

## 📞 Soporte

Si encuentras algún problema:

1. Revisa los logs en Vercel Dashboard
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que la base de datos esté accesible (si usas Neon)

¡Tu aplicación está lista para usar! 🎉