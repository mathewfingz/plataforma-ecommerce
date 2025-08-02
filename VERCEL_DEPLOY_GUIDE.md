# 🚀 Guía de Despliegue en Vercel

## 📋 Pre-requisitos

1. ✅ Cuenta en [Vercel](https://vercel.com)
2. ✅ Repositorio Git configurado
3. ✅ Base de datos Neon configurada (opcional para demo)

## 🔧 Variables de Entorno Requeridas

### Variables Críticas para NextAuth:
```bash
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=tu-secret-super-seguro-de-32-caracteres-minimo
NODE_ENV=production
```

### Variables de Base de Datos (Opcional):
```bash
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 🚀 Pasos de Despliegue

### 1. Conectar Repositorio
- Ve a [Vercel Dashboard](https://vercel.com/dashboard)
- Click en "New Project"
- Importa tu repositorio de GitHub

### 2. Configurar Proyecto
- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### 3. Variables de Entorno
Configura las siguientes variables en Vercel:

```bash
# Autenticación (CRÍTICO)
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=genera-un-secret-seguro-aqui
NODE_ENV=production

# Base de Datos (Opcional para demo)
DATABASE_URL=tu-url-de-neon
DIRECT_URL=tu-url-de-neon
```

### 4. Generar NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## 🔐 Credenciales de Demo

Una vez desplegado, puedes usar estas credenciales:

- **Admin:** admin@admin.com / admin123
- **Tienda:** tienda@tienda.com / tienda123

## 🛠️ Solución de Problemas

### Error de Build
Si hay errores de build, verifica:
1. Variables de entorno configuradas
2. Dependencias instaladas correctamente
3. Prisma schema generado

### Error de Autenticación
1. Verifica que `NEXTAUTH_URL` coincida con tu dominio
2. Asegúrate de que `NEXTAUTH_SECRET` esté configurado
3. Revisa que las rutas de callback estén correctas

## 📊 Monitoreo Post-Despliegue

- ✅ Verifica que la página de login cargue
- ✅ Prueba autenticación con credenciales demo
- ✅ Confirma redirección a dashboards
- ✅ Verifica que los roles funcionen correctamente

## 🔄 Actualizaciones

Para actualizar el despliegue:
1. Haz push a la rama main
2. Vercel desplegará automáticamente
3. Verifica que todo funcione correctamente