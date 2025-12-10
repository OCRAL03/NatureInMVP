import { Link } from 'react-router-dom'

export default function RoleSidebar({ role }: { role: 'student'|'teacher'|'expert'|'admin' }) {
  const items = role === 'student'
    ? [
        { to: '/dashboard/student', label: 'Resumen' },
        { to: '/messages', label: 'Mensajes' },
        { to: '/explore', label: 'Lugares' },
        { to: '/content', label: 'Fichas' },
      ]
    : role === 'teacher'
    ? [
        { to: '/dashboard/teacher', label: 'Panel Docente' },
        { to: '/messages', label: 'Mensajes' },
        { to: '/content/catalog', label: 'Catálogo' },
        { to: '/gamify', label: 'Gamificación' },
      ]
    : role === 'expert'
    ? [
        { to: '/dashboard/expert', label: 'Panel Experto' },
        { to: '/messages', label: 'Mensajes' },
        { to: '/content', label: 'Contenido' },
      ]
    : [
        { to: '/dashboard/admin', label: 'Administración' },
        { to: '/admin', label: 'Django Admin' },
        { to: '/messages', label: 'Mensajes' },
      ]
  return (
    <aside className="w-48 shrink-0">
      <nav className="flex flex-col gap-2">
        {items.map(i => (
          <Link key={i.to} to={i.to} className="btn-outline text-left px-3 py-2">
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

