# Gastos Hormiga 🐜

Aplicación minimalista para el control de "gastos hormiga" - esos pequeños gastos diarios que pasan desapercibidos pero que suman con el tiempo.

![Gastos Hormiga](https://img.shields.io/badge/version-1.0.0-00d9c0?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)

## ✨ Características

- **Registro Rápido**: Formulario minimalista con autocompletado
- **Gastos Rápidos**: Botones preconfigurados para gastos frecuentes (un tap = gasto registrado)
- **Vista Mensual**: Dashboard con resumen, gráficos y lista de gastos agrupados por día
- **Categorización Automática**: Inferencia inteligente de categorías basada en el concepto
- **Metas de Ahorro**: Límite mensual con barra de progreso visual (verde → amarillo → rojo)
- **Modo Vergüenza 😅**: Proyecciones anuales para reflexionar sobre tus gastos
- **Estadísticas**: Gráficos por categoría, día de la semana y tendencia mensual
- **PWA**: Instalable en Android, funciona offline
- **Tema Oscuro**: Diseño moderno y cómodo para la vista

## 🛠 Stack Tecnológico

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite (base de datos local)
- API RESTful

### Frontend
- React 18 + TypeScript
- Zustand (estado global)
- Material UI v5
- React Router DOM
- Recharts (gráficos)
- PWA (Vite PWA Plugin)

## 📁 Estructura del Proyecto

```
/gastos-hormiga
├── /backend
│   ├── /src
│   │   ├── /controllers    # Controladores de API
│   │   ├── /services       # Lógica de negocio
│   │   ├── /routes         # Definición de rutas
│   │   ├── /middleware     # Error handling
│   │   ├── /prisma         # Schema de BD
│   │   └── /utils          # Utilidades
│   └── package.json
│
├── /frontend
│   ├── /public
│   │   └── /icons          # Iconos PWA
│   ├── /src
│   │   ├── /components     # Componentes React
│   │   ├── /pages          # Páginas de la app
│   │   ├── /store          # Estado global (Zustand)
│   │   ├── /services       # Cliente API
│   │   ├── /utils          # Utilidades
│   │   └── /theme          # Tema Material UI
│   └── package.json
│
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Generar cliente de Prisma
npm run db:generate

# Crear base de datos y aplicar schema
npm run db:push

# (Opcional) Cargar datos de ejemplo
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

El backend correrá en `http://localhost:3001`

### Frontend

```bash
# En otra terminal, navegar al frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend correrá en `http://localhost:5173`

## 📱 Instalar como PWA

1. Abre la aplicación en Chrome (móvil o escritorio)
2. Espera a que aparezca el banner de instalación, o:
   - **Android**: Toca el menú ⋮ → "Agregar a pantalla de inicio"
   - **iOS Safari**: Toca compartir → "Agregar a pantalla de inicio"
   - **Chrome Desktop**: Icono de instalación en la barra de direcciones

## 🎯 API Endpoints

### Gastos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/expenses` | Listar gastos (filtros: month, year, from, to, category, search) |
| GET | `/api/expenses/:id` | Obtener un gasto |
| POST | `/api/expenses` | Crear gasto |
| PUT | `/api/expenses/:id` | Actualizar gasto |
| DELETE | `/api/expenses/:id` | Eliminar gasto |

### Gastos Rápidos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/quick-expenses` | Listar gastos rápidos |
| POST | `/api/quick-expenses` | Crear gasto rápido |
| PUT | `/api/quick-expenses/:id` | Actualizar |
| DELETE | `/api/quick-expenses/:id` | Eliminar |
| POST | `/api/quick-expenses/:id/use` | Usar (registrar gasto) |
| PUT | `/api/quick-expenses/reorder` | Reordenar |

### Estadísticas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/stats/monthly/:year/:month` | Stats del mes |
| GET | `/api/stats/yearly/:year` | Stats anuales (modo vergüenza) |
| GET | `/api/stats/comparison` | Comparativa mes actual vs anterior |
| GET | `/api/stats/by-category` | Por categoría |
| GET | `/api/stats/by-weekday` | Por día de semana |

### Configuración
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/settings` | Obtener configuración |
| PUT | `/api/settings` | Actualizar configuración |
| GET | `/api/budget/:year/:month` | Obtener presupuesto |
| POST | `/api/budget` | Establecer presupuesto |

## 🎨 Categorías

| ID | Nombre | Emoji | Color |
|----|--------|-------|-------|
| comida | Comida | 🍔 | #FF6B6B |
| bebidas | Bebidas | ☕ | #00d9c0 |
| transporte | Transporte | 🚌 | #60a5fa |
| antojos | Antojos | 🍫 | #fbbf24 |
| entretenimiento | Entretenimiento | 🎮 | #b388ff |
| otros | Otros | 📦 | #94a3b8 |

## 📊 Scripts Disponibles

### Backend
```bash
npm run dev        # Desarrollo con hot-reload
npm run build      # Compilar para producción
npm run start      # Ejecutar build de producción
npm run db:generate # Generar cliente Prisma
npm run db:push    # Aplicar schema a BD
npm run db:seed    # Cargar datos de ejemplo
npm run db:studio  # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev        # Desarrollo con hot-reload
npm run build      # Build de producción
npm run preview    # Preview del build
```

## 💡 Formato de Moneda

- Moneda: Peso Colombiano (COP)
- Formato: $12.500 (punto como separador de miles)
- Sin decimales

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

Hecho con 🐜 en Colombia
