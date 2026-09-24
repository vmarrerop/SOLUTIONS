export type Rol = 'admin' | 'tecnico' | 'cliente'

const KEY = 'sm-rol'

/* Credenciales de demo (quemadas en código): usuario + PIN */
export const PIN_DEMO = '1234'
export const USUARIOS_DEMO: Record<string, Rol> = {
  admin: 'admin',
  tecnico: 'tecnico',
  cliente: 'cliente',
}

/* En la demo, el usuario "cliente" pertenece a esta empresa */
export const CLIENTE_EMPRESA_ID = 'em-02'

export function getRol(): Rol | null {
  const rol = sessionStorage.getItem(KEY)
  return rol === 'admin' || rol === 'tecnico' || rol === 'cliente' ? rol : null
}

export function setRol(rol: Rol) {
  sessionStorage.setItem(KEY, rol)
}

export function cerrarSesion() {
  sessionStorage.removeItem(KEY)
  sessionStorage.removeItem('sm-firma')
}

/** Valida usuario + PIN y devuelve el rol, o null si son inválidos. */
export function validarCredenciales(usuario: string, pin: string): Rol | null {
  const rol = USUARIOS_DEMO[usuario.trim().toLowerCase()]
  if (!rol || pin !== PIN_DEMO) return null
  return rol
}

export function rutaDeRol(rol: Rol): string {
  if (rol === 'admin') return '/equipos'
  if (rol === 'tecnico') return '/tecnico/escanear'
  return '/cliente'
}
