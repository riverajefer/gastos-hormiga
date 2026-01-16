# Migración de PostgreSQL a SQLite

## Cambios realizados

### 1. Schema de Prisma
- Actualizado `backend/src/prisma/schema.prisma` para usar `sqlite` en lugar de `postgresql`

### 2. Configuración de la base de datos
- Creado archivo `.env` con la URL de SQLite: `file:./dev.db`
- Creado archivo `.env.example` como referencia

### 3. Script de seed
- Actualizado `backend/src/seed.ts` para cargar los datos del backup de PostgreSQL
- Incluye todos los gastos, presupuesto mensual, gastos rápidos y configuración de usuario

## Pasos para completar la migración

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Generar el cliente de Prisma
```bash
npm run db:generate
```

### 3. Crear la base de datos SQLite y las tablas
```bash
npm run db:push
```

Este comando creará el archivo `dev.db` con todas las tablas definidas en el schema.

### 4. Cargar los datos del backup
```bash
npm run db:seed
```

Este comando cargará:
- 12 gastos
- 1 presupuesto mensual
- 1 gasto rápido
- Configuración de usuario

### 5. Verificar la migración
Inicia el servidor:
```bash
npm run dev
```

El backend debería iniciar en `http://localhost:3001` usando la nueva base de datos SQLite.

## Ventajas de SQLite

- ✅ **Sin servidor externo**: La base de datos es un archivo local
- ✅ **Sin costos**: No necesitas pagar por hosting de base de datos
- ✅ **Fácil de respaldar**: Solo copia el archivo `dev.db`
- ✅ **Rápido para desarrollo**: Ideal para proyectos personales

## Notas importantes

1. El archivo `dev.db` se creará en el directorio `backend/`
2. Asegúrate de agregar `*.db` a tu `.gitignore` para no commitear la base de datos
3. Para producción, puedes usar el mismo archivo SQLite o considerar servicios como Turso (SQLite en la nube)

## Rollback a PostgreSQL

Si necesitas volver a PostgreSQL:
1. Cambia el `provider` en `schema.prisma` de `sqlite` a `postgresql`
2. Actualiza la `DATABASE_URL` en `.env` con la URL de PostgreSQL
3. Ejecuta `npm run db:push`
4. Restaura el backup con `psql`
