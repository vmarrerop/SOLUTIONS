# Solutions Machine · Portal de Gestión de Activos / Mantenimiento

Frontend del portal de Backoffice para la gestión de activos, servicios y
mantenimientos de Solutions Machine.

## Stack

- **React 19 + TypeScript** sobre **Vite**
- **Tailwind CSS v4** con design system propio (rojo `brand`, negro `ink`, grises `zinc`)
- **React Router** para navegación SPA
- **Recharts** (gráficas del dashboard) · **qrcode.react** (QR reales) · **lucide-react** (iconografía)

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción en /dist
```

## Estructura

```
src/
├── components/
│   ├── layout/        # AppLayout, Sidebar (desktop), Topbar, BottomNav (móvil)
│   └── ui.tsx         # Design system: Button, Card, badges, StatCard, etc.
├── data/mock.ts       # Datos semilla (empresas, equipos, revisiones, usuarios)
├── pages/             # Una página por módulo del alcance
├── store/             # DataContext: estado global con persistencia en localStorage
├── utils/qr.ts        # Descarga del QR como PNG y URL canónica del equipo
├── types.ts           # Modelo de dominio
└── App.tsx            # Rutas
```

## Módulos implementados (visual con datos mock)

| Ruta                 | Módulo del alcance                                              |
| -------------------- | --------------------------------------------------------------- |
| `/login`             | Acceso al portal                                                 |
| `/`                  | Dashboard: KPIs, gráficas, actividad y próximos mantenimientos   |
| `/equipos`           | Inventario de activos con búsqueda, filtros y filtro por empresa |
| `/equipos/nuevo`     | Registro de equipo asignado a una empresa + **QR real descargable (PNG)** |
| `/equipos/:id`       | Ficha técnica con empresa, **QR del equipo** e historial (timeline) |
| `/empresas`          | Gestión de **empresas/proyectos** (crear, editar, eliminar)      |
| `/escanear`          | **Lectura QR** con cámara (visor simulado + entrada manual)      |
| `/revisiones/nueva`  | **Formulario** con consecutivo automático, checklist y **fotos antes/después** |
| `/historial`         | **Historial** global con consecutivos y acceso a **PDF**         |
| `/usuarios`          | **Usuarios y permisos** por rol                                  |

## Diseño

- **Mobile-first**: bottom-navigation con acción central de escaneo en móvil;
  sidebar fija en escritorio (`lg+`). Tablas se transforman en cards en pantallas pequeñas.
- Identidad corporativa: rojo `#d21f30`, negro `#0a0a0c`, escala de grises.
- Tipografía **Inter**.

> Los datos son de demostración. La integración con el backend NodeJS
> (API REST, base de datos, almacenamiento de fotos y generación real de PDF)
> corresponde a la siguiente fase.
