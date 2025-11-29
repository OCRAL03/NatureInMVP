/* Minimal React widget for CTA messaging */
(function(){
  const e = React.createElement;
  function CTAApp(){
    const [index, setIndex] = React.useState(0);
    const messages = [
      "Explora especies nativas únicas",
      "Aprende con módulos interactivos",
      "Juega y gana insignias",
      "Registra avistamientos en tu zona"
    ];
    React.useEffect(() => {
      const id = setInterval(() => setIndex(i => (i + 1) % messages.length), 2600);
      return () => clearInterval(id);
    }, []);
    return e('div', { className: 'd-inline-flex align-items-center gap-2' }, [
      e('span', { className: 'badge bg-success' }, 'NatureIn'),
      e('span', null, messages[index])
    ]);
  }

  document.addEventListener('DOMContentLoaded', function(){
    var mount = document.getElementById('react-cta');
    if (mount) {
      const root = ReactDOM.createRoot(mount);
      root.render(e(CTAApp));
    }
  });
})();