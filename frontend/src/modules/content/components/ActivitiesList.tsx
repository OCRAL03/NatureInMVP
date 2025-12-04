export default function ActivitiesList() {
  const items = [
    { title: 'Lectura Otorongo', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=60', meta: 'Lectura • 10 min' },
    { title: 'Quiz de Flora y Fauna', img: 'https://images.unsplash.com/photo-1559070226-94c343a8b558?w=800&q=60', meta: 'Quiz • 8 min' },
    { title: 'Test "Explora y aprende en Tingo María"', img: 'https://images.unsplash.com/photo-1544717305-996b815c338c?w=800&q=60', meta: 'Test • 12 min' },
    { title: 'Lectura "Fauna Silvestre"', img: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=60', meta: 'Lectura • 9 min' },
  ]
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Actividades asociadas</h3>
        <button className="btn-outline clickable-green">Ver más</button>
      </div>
      <div className="activities-row">
        {items.map((a) => (
          <div key={a.title} className="activity-card">
            <img src={a.img} alt={a.title} />
            <div className="activity-title">{a.title}</div>
            <div className="activity-meta">{a.meta}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
