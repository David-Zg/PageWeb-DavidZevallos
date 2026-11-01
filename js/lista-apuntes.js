// lista-apuntes.js — muestra los apuntes de a pocos con un botón "Mostrar más"
(() => {
  const lista = document.querySelector('.lista-apuntes');
  if (!lista) return;

  const PASO = 4;        // cuántos se ven al inicio y cuántos se agregan en cada clic
  let limite = PASO;

  // Botón debajo de la lista (usa el mismo estilo que los chips de filtro)
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'chip mas-apuntes';
  boton.hidden = true;
  lista.after(boton);

  const filas = () => Array.from(lista.children).filter(el => el.tagName === 'LI');

  // Un apunte "coincide" si el filtro o el buscador no lo ocultaron
  const visible = el => el && !el.hidden && getComputedStyle(el).display !== 'none';
  const coincide = li => visible(li) && (!li.firstElementChild || visible(li.firstElementChild));

  const observador = new MutationObserver(() => requestAnimationFrame(aplicar));
  const observar = () => observador.observe(lista, {
    childList: true, subtree: true,
    attributes: true, attributeFilter: ['hidden', 'style', 'class']
  });

  function aplicar() {
    observador.disconnect();                       // evita que nuestros cambios se detecten a sí mismos

    const todas = filas();
    todas.forEach(li => li.classList.remove('recortado'));
    const coinciden = todas.filter(coincide);
    coinciden.forEach((li, i) => li.classList.toggle('recortado', i >= limite));

    const restantes = coinciden.length - limite;
    if (restantes > 0) {
      boton.hidden = false;
      boton.dataset.accion = 'mas';
      boton.textContent = `Mostrar ${Math.min(PASO, restantes)} más · quedan ${restantes}`;
    } else if (coinciden.length > PASO && limite > PASO) {
      boton.hidden = false;
      boton.dataset.accion = 'menos';
      boton.textContent = 'Mostrar menos';
    } else {
      boton.hidden = true;
    }

    observar();
    return coinciden;
  }

  boton.addEventListener('click', () => {
    if (boton.dataset.accion === 'mas') {
      const anterior = limite;
      limite += PASO;
      const coinciden = aplicar();
      // Lleva el foco al primer apunte nuevo (útil con teclado y lector de pantalla)
      coinciden[anterior]?.querySelector('a')?.focus({ preventScroll: true });
    } else {
      limite = PASO;
      aplicar();
      lista.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Al cambiar el filtro o la búsqueda, vuelve a empezar desde los primeros
  const reiniciar = () => { limite = PASO; requestAnimationFrame(aplicar); };
  document.querySelectorAll('.filtros .chip').forEach(c => c.addEventListener('click', reiniciar));
  document.querySelector('.buscador input')?.addEventListener('input', reiniciar);

  aplicar();
})();