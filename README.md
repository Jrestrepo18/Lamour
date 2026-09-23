# L'AMOUR — Estética y Sentidos

Sistema web completo para un spa de masajes tántricos, relajación, terapia de pareja y muscular con servicio a domicilio en Medellín y su área metropolitana.

## Estructura del repositorio

```
PAGE/
├── frontend/   Next.js 16 (App Router, TypeScript, Tailwind CSS v4, Framer Motion)
└── backend/    ASP.NET Core 8 Web API (C#, EF Core, SQLite, JWT)
```

## Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # ajusta NEXT_PUBLIC_API_URL si el backend corre en otro puerto
npm run dev                  # http://localhost:3000
```

- **Sitio público:** landing (`/`) con catálogo de servicios por categoría y flujo de reserva paso a paso (`/reservar`).
- **Panel admin:** `/admin/login` → `/admin/dashboard` (citas, masajistas, servicios).
- **Modo demo:** si `NEXT_PUBLIC_API_URL` no responde, el catálogo público y la disponibilidad usan datos de demostración (`src/lib/mock-data.ts`) para que la interfaz sea explorable sin el backend corriendo. El panel admin y la creación de reservas sí requieren la API real.

## Backend

Requiere el [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (no incluido en este entorno de desarrollo).

```bash
cd backend/LAmour.Api
dotnet restore
dotnet run                   # http://localhost:5080  (Swagger en /swagger, solo en Development)
```

Al iniciar, la base de datos SQLite (`lamour.db`) se crea automáticamente y se siembra con:

- Las 5 categorías y 16 servicios descritos en el brief (incluye la nota obligatoria de estimulación en masajes eróticos y el Masaje Voyerista "El Arte de Mirar").
- 4 masajistas de ejemplo.
- Un usuario administrador inicial. Sus credenciales se leen de configuración — nunca van en el repositorio:
  - `SeedAdmin:Username` (por defecto `admin`) y `SeedAdmin:Password`, en `appsettings.Development.local.json` (ignorado por git) o como variables de entorno `SeedAdmin__Username` / `SeedAdmin__Password`.
  - Si no defines la contraseña, la API genera una aleatoria al crear la base de datos y la muestra **una sola vez** en la consola.

### Configuración (`appsettings.json`)

| Clave | Uso |
|---|---|
| `ConnectionStrings:Default` | Cadena de conexión SQLite. Cambiar el proveedor (`UseSqlite` → `UseNpgsql`/`UseSqlServer` en `Program.cs`) para producción. |
| `Jwt:Key` | Secreto para firmar los tokens del admin. **Debe reemplazarse** por una variable de entorno en producción. |
| `Cors:AllowedOrigins` | Dominios del frontend autorizados. |
| `Business:OpeningHour/ClosingHour/SlotIntervalMinutes` | Horario de atención y granularidad de los turnos disponibles. |

### Notas de arquitectura

- **Disponibilidad en tiempo real:** `AvailabilityService` calcula franjas libres por masajista cruzando su agenda de citas activas; el endpoint `/api/availability` la expone y el flujo de reserva del frontend la consulta en vivo.
- **WhatsApp:** al confirmar una cita desde el panel admin, `WhatsAppLinkService` genera un enlace `wa.me` con todos los datos de la cita ya redactados; el admin solo debe hacer clic para enviarlo. No requiere cuenta de WhatsApp Business API — puede migrarse a la API oficial más adelante reemplazando ese servicio.
- **Auth:** JWT simple con un único rol `Admin`, contraseñas con PBKDF2 (sin dependencias de ASP.NET Identity).
- La base de datos se crea con `EnsureCreated()` (sin migraciones) para simplificar el arranque en desarrollo. Para producción se recomienda migrar a `dotnet ef migrations`.

## Despliegue

- **Frontend:** listo para Vercel. Configura `NEXT_PUBLIC_API_URL` como variable de entorno apuntando a la API pública.
- **Backend:** cualquier host compatible con ASP.NET Core (Azure App Service, Railway, un VPS con contenedor). Cambia el proveedor de EF Core a PostgreSQL o SQL Server para producción y define `Jwt:Key`/`Cors:AllowedOrigins` como variables de entorno.

## Paleta de marca (Tailwind, `frontend/src/app/globals.css`)

| Token | Hex | Uso |
|---|---|---|
| `ivory` | `#FDFBF7` | Fondo general |
| `silk` | `#E6DFD3` | Superficies y tarjetas |
| `champagne` | `#E8D8B0` | Acentos sutiles |
| `gold` | `#D4AF37` | CTAs y bordes destacados |
| `ink` / `ink-soft` | — | Texto principal / secundario |
