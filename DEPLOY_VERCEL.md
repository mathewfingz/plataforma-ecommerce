# 🚀 Deploy en Vercel - Guía Paso a Paso

## 📋 Pre-requisitos
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [GitHub](https://github.com)
- Base de datos PostgreSQL (recomendado: [Neon](https://neon.tech))

## 🔧 Paso 1: Preparar el Repositorio en GitHub

### 1.1 Crear Repositorio
1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. Nombre sugerido: `plataforma-ecommerce`
3. Configúralo como **público** o **privado** según prefieras
4. **NO** inicialices con README (ya tenemos archivos)

### 1.2 Subir el Código
```bash
# En la terminal, navega a tu proyecto
cd "/Users/mateotarazona/Downloads/NEw design"

# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Plataforma E-commerce Multi-tienda"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/plataforma-ecommerce.git

# Subir el código
git push -u origin main
```

## 🗄️ Paso 2: Configurar Base de Datos

### 2.1 Crear Base de Datos en Neon
1. Ve a [Neon.tech](https://neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la **DATABASE_URL** (formato: `postgresql://...`)

### 2.2 Alternativas de Base de Datos
- **Supabase**: [supabase.com](https://supabase.com)
- **PlanetScale**: [planetscale.com](https://planetscale.com)
- **Railway**: [railway.app](https://railway.app)

## 🚀 Paso 3: Deploy en Vercel

### 3.1 Conectar Repositorio
1. Ve a [Vercel](https://vercel.com)
2. Haz clic en **"New Project"**
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `plataforma-ecommerce`
5. Haz clic en **"Import"**

### 3.2 Configurar Variables de Entorno
En la sección **Environment Variables**, agrega:

```env
# Autenticación
NEXTAUTH_SECRET=tu_secret_super_seguro_aqui_32_caracteres_minimo
NEXTAUTH_URL=https://tu-proyecto.vercel.app

# Base de Datos
DATABASE_URL=postgresql://usuario:password@host:5432/database

# Opcional
NODE_ENV=production
NEXTAUTH_DEBUG=false
```

### 3.3 Configuración de Build
- **Framework Preset**: Next.js
- **Root Directory**: `./` (raíz del proyecto)
- **Build Command**: Se usa automáticamente desde `vercel.json`
- **Output Directory**: Se usa automáticamente desde `vercel.json`

### 3.4 Deploy
1. Haz clic en **"Deploy"**
2. Espera a que termine el build (puede tomar 2-5 minutos)
3. ¡Tu aplicación estará lista!

## 🔧 Paso 4: Configurar Base de Datos

### 4.1 Ejecutar Migraciones
Una vez deployado, ejecuta las migraciones:

1. Ve a tu proyecto en Vercel
2. Ve a la pestaña **"Functions"**
3. Busca la función de API
4. O usa Vercel CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Ejecutar comando en producción
vercel env pull .env.production
cd apps/web
npx prisma migrate deploy
npx prisma db seed
```

### 4.2 Verificar Deployment
Visita tu URL de Vercel y verifica:
- ✅ La página de login carga correctamente
- ✅ Puedes hacer login con las credenciales por defecto
- ✅ Los dashboards funcionan
- ✅ La API responde correctamente

## 🔐 Credenciales de Acceso

### Sin Base de Datos (Fallback)
- **Admin**: `admin@test.com` / `admin123`
- **Tienda**: `tienda@test.com` / `tienda123`

### Con Base de Datos (Después del Seed)
- **Admin**: `admin@plataforma.com` / `admin123`
- **Tienda 1**: `tienda1@email.com` / `tienda123`

## 🛠️ Troubleshooting

### Error de Build
Si el build falla:
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs en Vercel Dashboard
3. Asegúrate de que `DATABASE_URL` sea válida

### Error de Base de Datos
Si hay errores de conexión:
1. Verifica que la `DATABASE_URL` sea correcta
2. Asegúrate de que la base de datos esté activa
3. Ejecuta las migraciones manualmente

### Error de Autenticación
Si NextAuth no funciona:
1. Verifica que `NEXTAUTH_SECRET` tenga al menos 32 caracteres
2. Asegúrate de que `NEXTAUTH_URL` coincida con tu dominio de Vercel
3. Revisa que no haya espacios extra en las variables

## 📊 URLs Importantes

- **Aplicación**: `https://tu-proyecto.vercel.app`
- **Login**: `https://tu-proyecto.vercel.app/auth/signin`
- **Admin Dashboard**: `https://tu-proyecto.vercel.app/admin`
- **Tienda Dashboard**: `https://tu-proyecto.vercel.app/tienda`
- **API Health**: `https://tu-proyecto.vercel.app/api/health`

## 🔄 Actualizaciones Futuras

Para actualizar la aplicación:
1. Haz cambios en tu código local
2. Commit y push a GitHub
3. Vercel automáticamente hará redeploy

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

## 🎯 Próximos Pasos

1. **Configurar Dominio Personalizado** en Vercel
2. **Configurar SSL** (automático en Vercel)
3. **Monitoreo** con Vercel Analytics
4. **Optimización** de performance
5. **Backup** de base de datos

¡Tu plataforma de e-commerce está lista para producción! 🎉