# 🚀 Deploy Manual - 5 Minutos

## Paso 1: Crear Repositorio en GitHub
1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `plataforma-ecommerce`
3. Descripción: `Plataforma E-commerce Multi-tienda`
4. **Público** o **Privado** (tu elección)
5. **NO** marcar "Add a README file"
6. Clic en **"Create repository"**

## Paso 2: Subir Código
Copia y pega estos comandos en tu terminal:

```bash
# Navegar al proyecto
cd "/Users/mateotarazona/Downloads/NEw design"

# Configurar Git (si es primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Agregar remote (reemplaza TU_USUARIO con tu username de GitHub)
git remote add origin https://github.com/TU_USUARIO/plataforma-ecommerce.git

# Subir código
git push -u origin main
```

## Paso 3: Deploy en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Clic en **"New Project"**
3. **"Import Git Repository"**
4. Selecciona `plataforma-ecommerce`
5. Configuración:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: (automático)
   - **Output Directory**: (automático)

## Paso 4: Variables de Entorno
En Vercel, agrega estas variables:

```env
NEXTAUTH_SECRET=genera_un_secret_de_32_caracteres_aqui
NEXTAUTH_URL=https://tu-proyecto.vercel.app
DATABASE_URL=postgresql://usuario:password@host:5432/database
NODE_ENV=production
```

### Generar NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Paso 5: Base de Datos (Opcional)
Si quieres base de datos real:

### Neon.tech (Gratis):
1. Ve a [neon.tech](https://neon.tech)
2. Crea cuenta y proyecto
3. Copia la `DATABASE_URL`
4. Pégala en Vercel

### Sin Base de Datos:
- Deja `DATABASE_URL` vacía
- Usará usuarios mock automáticamente

## Paso 6: Deploy
1. Clic en **"Deploy"** en Vercel
2. Espera 2-5 minutos
3. ¡Listo! 🎉

## 🔐 Credenciales de Acceso
- **Admin**: `admin@test.com` / `admin123`
- **Tienda**: `tienda@test.com` / `tienda123`

## 📱 URLs Importantes
- **App**: `https://tu-proyecto.vercel.app`
- **Login**: `https://tu-proyecto.vercel.app/auth/signin`
- **Admin**: `https://tu-proyecto.vercel.app/admin`
- **Tienda**: `https://tu-proyecto.vercel.app/tienda`

---

**⏱️ Tiempo total: 5-10 minutos**