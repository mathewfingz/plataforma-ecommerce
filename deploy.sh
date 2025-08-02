#!/bin/bash

# 🚀 Script de Deploy para Vercel
# Plataforma E-commerce Multi-tienda

echo "🚀 Iniciando proceso de deploy..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Limpiar cache de Next.js
echo "🧹 Limpiando cache..."
rm -rf apps/web/.next
rm -rf apps/web/node_modules/.cache

# Verificar build local
echo "🔨 Verificando build local..."
cd apps/web
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build local. Revisa los errores antes de continuar."
    exit 1
fi

cd ..

# Preparar Git
echo "📦 Preparando repositorio Git..."

# Verificar si Git está inicializado
if [ ! -d ".git" ]; then
    echo "🔧 Inicializando Git..."
    git init
fi

# Agregar archivos
echo "📝 Agregando archivos..."
git add .

# Hacer commit
echo "💾 Haciendo commit..."
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

echo "✅ Proyecto preparado para deploy!"
echo ""
echo "🔗 Próximos pasos:"
echo "1. Crea un repositorio en GitHub"
echo "2. Conecta tu repositorio local:"
echo "   git remote add origin https://github.com/TU_USUARIO/plataforma-ecommerce.git"
echo "3. Sube el código:"
echo "   git push -u origin main"
echo "4. Ve a Vercel.com y conecta tu repositorio"
echo ""
echo "📖 Para más detalles, consulta DEPLOY_VERCEL.md"