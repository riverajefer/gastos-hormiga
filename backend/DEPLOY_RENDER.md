# Deploy en Render - Gastos Hormiga 🐜

## Paso 1: Subir a GitHub

```bash
# En la carpeta backend
cd backend
git init
git add .
git commit -m "Initial commit - Gastos Hormiga API"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/TU_USUARIO/gastos-hormiga-api.git
git push -u origin main
```

## Paso 2: Crear PostgreSQL en Render

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Click en **New +** → **PostgreSQL**
3. Configura:
   - **Name**: `gastos-hormiga-db`
   - **Database**: `gastos_hormiga`
   - **User**: `gastos_user`
   - **Region**: Oregon (o el más cercano)
   - **Plan**: **Free**
4. Click **Create Database**
5. Espera a que se cree (~1-2 min)
6. Copia la **Internal Database URL** (la necesitarás)

## Paso 3: Crear Web Service

1. Click en **New +** → **Web Service**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: `gastos-hormiga-api`
   - **Region**: Mismo que la BD
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build && npm run db:push`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

4. En **Environment Variables**, agrega:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | (pega la Internal Database URL del paso 2) |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | `https://tu-frontend.netlify.app` (actualiza después) |

5. Click **Create Web Service**

## Paso 4: Verificar Deploy

1. Espera a que termine el deploy (~3-5 min)
2. Tu API estará en: `https://gastos-hormiga-api.onrender.com`
3. Verifica con: `https://gastos-hormiga-api.onrender.com/health`

## Paso 5: Configurar Frontend

Actualiza tu frontend para usar la API de Render:

```typescript
// En frontend/src/services/api.ts
const API_BASE = import.meta.env.PROD 
  ? 'https://gastos-hormiga-api.onrender.com/api'
  : '/api';
```

O crea un archivo `.env.production`:
```
VITE_API_URL=https://gastos-hormiga-api.onrender.com
```

## Notas Importantes

### ⚠️ Tier Gratuito de Render

- El servicio se "duerme" después de 15 min sin uso
- Tarda ~30-50 segundos en despertar
- La BD gratuita expira después de 90 días (solo creas otra)
- Límite de 750 horas/mes de ejecución

### 💡 Tips

1. **Para evitar que se duerma**: Usa un servicio como [cron-job.org](https://cron-job.org) para hacer ping cada 14 min
2. **Logs**: Ve a tu servicio → Logs para ver errores
3. **Redeploy**: Push a GitHub = deploy automático

### 🔧 Si algo falla

```bash
# Verifica los logs en Render Dashboard → Logs

# Errores comunes:
# - "Cannot find module": npm run build no corrió bien
# - "Connection refused": DATABASE_URL incorrecta
# - "CORS error": Agrega FRONTEND_URL a las env vars
```

## Comandos Útiles Locales

```bash
# Probar build local
npm run build

# Verificar que Prisma genera bien
npm run db:generate

# Ver estructura de BD
npm run db:studio
```

---

¿Problemas? Revisa los logs en el dashboard de Render 🔍
