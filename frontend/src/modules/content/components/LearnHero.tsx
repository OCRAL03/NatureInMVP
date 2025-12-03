export default function LearnHero() {
  return (
    <section className="learn-hero">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Conoce como aprender con NatureIn</h2>
          <p className="text-sm text-gray-700">Aprende gratis con lecturas y videos. Busca a tus amigos y juega.</p>
          <button className="learn-cta">Empieza a aprender ahora</button>
        </div>
        <div className="learn-avatars">
          {[1,2,3,4].map((i) => (
            <div key={i} className="w-14 h-14 rounded-full overflow-hidden border">
              <img src={`https://placehold.co/100x100?text=${i}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
