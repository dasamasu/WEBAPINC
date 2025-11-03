# TiendaNC - Sistema de Gestión de Productos

Una aplicación full-stack moderna para la gestión de productos con autenticación, roles de usuario y una interfaz de usuario atractiva.

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18+** con TypeScript
- **Vite** como bundler
- **TailwindCSS** para estilos
- **Zustand** para manejo de estado
- **React Router DOM v6** para routing
- **Framer Motion** para animaciones
- **React Hook Form** + **Zod** para formularios y validación
- **Axios** para peticiones HTTP
- **React Hot Toast** para notificaciones

### Backend
- **.NET 8** con ASP.NET Core Web API
- **Entity Framework Core** con SQL Server
- **JWT** para autenticación
- **BCrypt** para hash de contraseñas
- **Repository Pattern** + **Unit of Work**
- **Swagger** para documentación de API

## 📁 Estructura del Proyecto

```
TiendaNC/
├── Backend/
│   └── TiendaNC.API/
│       ├── Controllers/          # Controladores de API
│       ├── Data/                 # DbContext y configuración de base de datos
│       ├── DTOs/                 # Data Transfer Objects
│       ├── Enums/                # Enumeraciones
│       ├── Models/               # Modelos de entidad
│       ├── Repository/           # Patrón Repository
│       ├── Services/             # Servicios (JWT, etc.)
│       └── Program.cs            # Configuración de la aplicación
├── Frontend/
│   └── tienda-nc-frontend/
│       ├── src/
│       │   ├── components/       # Componentes reutilizables
│       │   ├── hooks/            # Custom hooks
│       │   ├── pages/            # Páginas de la aplicación
│       │   ├── services/         # Servicios de API
│       │   ├── store/            # Store de Zustand
│       │   ├── types/            # Tipos de TypeScript
│       │   └── utils/            # Utilidades
│       ├── public/               # Archivos estáticos
│       └── package.json
└── README.md
```

## 🎯 Características

### Funcionalidades Principales
- ✅ **Autenticación JWT** con login y registro
- ✅ **Gestión de Roles** (Admin/Usuario)
- ✅ **CRUD de Productos** con validación
- ✅ **Filtros y Búsqueda** de productos
- ✅ **Gestión de Usuarios** (solo Admin)
- ✅ **Interfaz Responsiva** y moderna
- ✅ **Animaciones fluidas** con Framer Motion
- ✅ **Notificaciones** interactivas
- ✅ **Componentes de carga** (skeletons)
- ✅ **Diálogos de confirmación**

### Características Técnicas
- ✅ **Repository Pattern** y **Unit of Work**
- ✅ **Validación** en frontend y backend
- ✅ **Manejo de errores** centralizado
- ✅ **CORS** configurado
- ✅ **Swagger** para documentación
- ✅ **Seeds** de datos iniciales
- ✅ **TypeScript** en frontend
- ✅ **Componentes modulares** y reutilizables

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 18+
- .NET 8 SDK
- SQL Server o SQL Server Express

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd TiendaNC
```

### 2. Configurar el Backend

```bash
# Navegar al directorio del backend
cd Backend/TiendaNC.API

# Restaurar paquetes
dotnet restore

# Configurar la cadena de conexión en appsettings.json
# Editar ConnectionStrings:DefaultConnection

# Ejecutar migraciones (si es necesario)
dotnet ef database update

# Ejecutar la aplicación
dotnet run
```

La API estará disponible en `https://localhost:7240`

### 3. Configurar el Frontend

```bash
# Navegar al directorio del frontend
cd Frontend/tienda-nc-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Copiar .env.example a .env.local y ajustar según sea necesario

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación frontend estará disponible en `http://localhost:5173`

## 🔐 Usuarios por Defecto

Al ejecutar la aplicación por primera vez, se crean los siguientes usuarios:

### Administrador
- **Email:** admin@tiendanc.com
- **Contraseña:** Admin123!

### Usuario Regular
- **Email:** user@tiendanc.com  
- **Contraseña:** User123!

## 📋 Scripts Disponibles

### Frontend
```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa del build
npm run lint         # Ejecutar linter
```

### Backend
```bash
dotnet run           # Ejecutar la aplicación
dotnet build         # Construir el proyecto
dotnet test          # Ejecutar tests (si están disponibles)
```

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/refresh-token` - Renovar token

### Productos
- `GET /api/products` - Obtener productos con filtros
- `GET /api/products/{id}` - Obtener producto por ID
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/{id}` - Actualizar producto (Admin)
- `DELETE /api/products/{id}` - Eliminar producto (Admin)

### Usuarios
- `GET /api/users` - Obtener usuarios (Admin)
- `DELETE /api/users/{id}` - Eliminar usuario (Admin)
- `PATCH /api/users/{id}/role` - Cambiar rol (Admin)

## 🎨 Componentes Principales

### Frontend
- **ProductCard** - Tarjeta de producto con animaciones
- **ProductFormModal** - Modal para crear/editar productos
- **Navbar** - Barra de navegación responsive
- **ProtectedRoute** - Componente para rutas protegidas
- **ConfirmDialog** - Diálogo de confirmación reutilizable
- **Skeleton** - Componentes de carga

### Backend
- **AuthController** - Manejo de autenticación
- **ProductsController** - CRUD de productos
- **UsersController** - Gestión de usuarios
- **TokenService** - Generación y validación de JWT

## 🔧 Configuración Adicional

### Variables de Entorno (Frontend)
```env
VITE_API_URL=https://localhost:7240/api
VITE_APP_NAME=TiendaNC
VITE_APP_VERSION=1.0.0
```

### Configuración de CORS
El backend está configurado para permitir conexiones desde `http://localhost:5173` en desarrollo.

### Base de Datos
- La aplicación incluye seeds para crear usuarios y productos de ejemplo
- Se requiere SQL Server para el almacenamiento

## 📝 Notas de Desarrollo

- La aplicación está diseñada con un enfoque **mobile-first**
- Se utiliza **TypeScript** para mayor seguridad de tipos
- Los formularios incluyen **validación en tiempo real**
- Las animaciones están optimizadas para rendimiento
- El diseño sigue principios de **UX moderna**

## 🚀 Deploy

### Frontend (Vercel/Netlify)
1. Configurar variables de entorno en la plataforma
2. Conectar repositorio
3. Deploy automático

### Backend (Azure/AWS)
1. Configurar cadena de conexión de base de datos
2. Configurar variables de entorno
3. Deploy usando pipelines CI/CD

## 🐛 Solución de Problemas

### Problemas Comunes
1. **Error de CORS:** Verificar configuración de CORS en el backend
2. **Error de conexión DB:** Verificar cadena de conexión y permisos
3. **Error 401:** Verificar que el token JWT sea válido

### Logs
- Backend: Logs en consola durante desarrollo
- Frontend: DevTools del navegador

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

---

**Desarrollado con ❤️ usando tecnologías modernas**
