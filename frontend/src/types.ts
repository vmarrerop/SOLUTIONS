export type EstadoEquipo = 'operativo' | 'mantenimiento' | 'fuera_servicio'

export interface Empresa {
  id: string
  nombre: string
  nit: string
  contacto: string
  telefono: string
  ciudad: string
}

export interface Equipo {
  id: string
  empresaId: string
  codigo: string
  nombre: string
  tipo: string
  marca: string
  modelo: string
  serial: string
  ubicacion: string
  fechaInstalacion: string
  estado: EstadoEquipo
  ultimaRevision: string | null
  proximaRevision: string
  responsable: string
}

export type TipoServicio = 'preventivo' | 'correctivo' | 'revision' | 'instalacion'

export type EstadoRevision = 'completado' | 'en_proceso' | 'pendiente'

export interface Revision {
  id: string
  consecutivo: string
  equipoId: string
  tipo: TipoServicio
  tecnico: string
  fecha: string
  estado: EstadoRevision
  observaciones: string
  fotosAntes: number
  fotosDespues: number
  duracionMin: number | null
}

export type RolUsuario = 'admin' | 'supervisor' | 'tecnico' | 'consulta'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: RolUsuario
  estado: 'activo' | 'inactivo'
  ultimoAcceso: string
}
