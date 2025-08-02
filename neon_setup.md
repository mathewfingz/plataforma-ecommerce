# 🚀 Configuración de Neon Database

## ✅ Estado Actual
- ✅ Driver de Neon instalado (`@neondatabase/serverless`)
- ✅ Prisma configurado para Neon
- ✅ NextAuth configurado con adaptador de Prisma
- ✅ Script de seed preparado
- ✅ Usuarios mock como fallback

## 🔧 Pasos para Configurar Neon

### 1. Crear Cuenta en Neon
1. Ve a [https://neon.tech](https://neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto

### 2. Obtener Connection String
1. En tu proyecto de Neon, ve a "Connection Details"
2. Copia la **Connection String** (algo como):
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### 3. Configurar Variables de Entorno
Edita el archivo `apps/web/.env.local` y reemplaza:

```env
# Reemplaza con tu connection string real de Neon
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### 4. Crear las Tablas en la Base de Datos
```bash
cd apps/web
npm run db:push
```

### 5. Poblar la Base de Datos con Datos de Prueba
```bash
npm run db:seed
```

### 6. Reiniciar el Servidor
```bash
npm run dev
```

## 🔐 Credenciales de Prueba

Una vez configurado Neon, podrás usar estas credenciales:

### Administrador
- **Email:** admin@plataforma.com
- **Contraseña:** admin123

### Tiendas
- **Moda Urbana:** tienda1@email.com / tienda123
- **TechStore:** tienda2@email.com / tienda123  
- **Casa & Hogar:** tienda3@email.com / tienda123

## 🔄 Fallback Automático

Si Neon no está configurado o hay problemas de conexión, el sistema automáticamente usará usuarios mock para desarrollo, permitiendo que la aplicación funcione sin base de datos.

## 🛠️ Comandos Útiles

```bash
# Ver el estado de la base de datos
npm run db:studio

# Generar cliente de Prisma
npm run db:generate

# Crear nueva migración
npm run db:migrate

# Resetear base de datos (¡CUIDADO!)
npx prisma db push --force-reset
```

## 🚨 Troubleshooting

### Error de Conexión
- Verifica que las URLs en `.env.local` sean correctas
- Asegúrate de que el proyecto de Neon esté activo
- Revisa que no haya espacios extra en las variables de entorno

### Tablas No Existen
```bash
npm run db:push
npm run db:seed
```

### Problemas de Autenticación
- Verifica que el servidor esté reiniciado después de cambiar `.env.local`
- Revisa los logs del servidor para errores específicos

## 📊 Verificar Configuración

Para verificar que todo funciona:

1. Inicia el servidor: `npm run dev`
2. Ve a `http://localhost:3000/login`
3. Intenta hacer login con las credenciales de prueba
4. Si funciona con la base de datos, verás datos reales
5. Si usa fallback, verás usuarios mock pero la app funcionará

¡Listo! Tu aplicación ahora está configurada para usar Neon Database. 🎉