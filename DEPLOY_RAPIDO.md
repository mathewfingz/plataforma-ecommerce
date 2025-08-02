# 🚀 Deploy Rápido - 3 Pasos

## Paso 1: Crear Repositorio
1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `plataforma-ecommerce`
3. Público
4. **NO** marcar README
5. Crear repositorio

## Paso 2: Subir Código
Ejecuta estos comandos:

```bash
cd "/Users/mateotarazona/Downloads/NEw design"

# Configurar remote (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/plataforma-ecommerce.git

# Subir código
git push -u origin main
```

## Paso 3: Deploy Vercel
1. [vercel.com/new](https://vercel.com/new)
2. Import `plataforma-ecommerce`
3. Variables de entorno:
   ```
   NEXTAUTH_SECRET=tu_secret_de_32_caracteres
   NEXTAUTH_URL=https://tu-proyecto.vercel.app
   DATABASE_URL=postgresql://... (opcional)
   NODE_ENV=production
   ```
4. Deploy

## 🎯 Generar NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---
**⏱️ Tiempo: 5 minutos**