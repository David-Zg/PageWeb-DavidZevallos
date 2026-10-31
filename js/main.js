/* =========================================================================
   main.js — comportamiento del sitio (JavaScript puro, sin librerías)
   ========================================================================= */
(function () {
  'use strict';

  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  /* ---------- Utilidades ---------- */

  function crear(etiqueta, atributos, hijos) {
    var el = document.createElement(etiqueta);
    if (atributos) {
      Object.keys(atributos).forEach(function (k) {
        var v = atributos[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'texto') el.textContent = v;
        else if (k === 'clase') el.className = v;
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    (hijos || []).forEach(function (h) {
      if (h) el.appendChild(typeof h === 'string' ? document.createTextNode(h) : h);
    });
    return el;
  }

  var formatoFecha = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  function fechaLegible(iso) {
    var p = iso.split('-').map(Number);
    return formatoFecha.format(new Date(p[0], p[1] - 1, p[2])).replace('.', '');
  }

  // Quita tildes y pasa a minúsculas, para que la búsqueda ignore acentos
  function normalizar(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function guardar(clave, valor) { try { localStorage.setItem(clave, valor); } catch (e) {} }
  function leer(clave) { try { return localStorage.getItem(clave); } catch (e) { return null; } }

  /* ---------- Tema claro / oscuro ---------- */

  function temaActual() {
    var fijado = document.documentElement.dataset.tema;
    if (fijado) return fijado;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
  }

  function iniciarTema() {
    var boton = $('.tema-boton');
    if (!boton) return;
    function rotular() {
      boton.setAttribute('aria-label', temaActual() === 'oscuro' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    }
    rotular();
    boton.addEventListener('click', function () {
      var nuevo = temaActual() === 'oscuro' ? 'claro' : 'oscuro';
      document.documentElement.dataset.tema = nuevo;
      guardar('tema', nuevo);
      rotular();
    });
  }

  /* ---------- Menú en móvil ---------- */

  function iniciarMenu() {
    var boton = $('.menu-boton');
    var menu = $('#menu-principal');
    if (!boton || !menu) return;

    function cerrar() {
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
      menu.classList.remove('menu--abierto');
    }
    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      if (abierto) { cerrar(); return; }
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', 'Cerrar menú');
      menu.classList.add('menu--abierto');
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', cerrar); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  }

  /* ---------- Copiar al portapapeles ---------- */

  function iniciarCopiar() {
    $$('[data-copiar]').forEach(function (boton) {
      boton.addEventListener('click', function () {
        var origen = document.getElementById(boton.dataset.copiar);
        if (!origen) return;
        var texto = origen.textContent.trim();
        function hecho() {
          boton.textContent = 'Copiado';
          setTimeout(function () { boton.textContent = 'Copiar'; }, 1800);
        }
        function seleccionar() {
          var r = document.createRange();
          r.selectNodeContents(origen);
          var s = window.getSelection();
          s.removeAllRanges();
          s.addRange(r);
          boton.textContent = 'Selecciónalo y copia';
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(texto).then(hecho, seleccionar);
        } else {
          seleccionar();
        }
      });
    });
  }

  /* ---------- Apuntes: filtros + búsqueda ---------- */

  function iniciarApuntes(datos) {
    var lista = $('#lista-apuntes');
    var filtros = $('#filtros');
    var buscar = $('#buscar');
    var contador = $('#contador-apuntes');
    var vacio = $('#sin-resultados');
    if (!lista || !filtros) return;

    var apuntes = datos.slice().sort(function (a, b) { return b.fecha.localeCompare(a.fecha); });

    var cursos = ['Todos'];
    apuntes.forEach(function (a) { if (cursos.indexOf(a.curso) === -1) cursos.push(a.curso); });

    var estado = { curso: leer('filtro-curso') || 'Todos', texto: '' };
    if (cursos.indexOf(estado.curso) === -1) estado.curso = 'Todos';

    cursos.forEach(function (c) {
      var b = crear('button', { type: 'button', clase: 'chip', 'data-curso': c, texto: c });
      b.addEventListener('click', function () {
        estado.curso = c;
        guardar('filtro-curso', c);
        pintar();
      });
      filtros.appendChild(b);
    });

    if (buscar) {
      buscar.addEventListener('input', function () {
        estado.texto = normalizar(buscar.value.trim());
        pintar();
      });
    }

    function fila(a) {
      var meta = crear('span', { clase: 'apunte__meta' }, [
        fechaLegible(a.fecha) + ' · ' + a.paginas + ' pág.'
      ]);
      var contenido = [
        crear('span', { clase: 'apunte__curso', texto: a.curso }),
        crear('span', { clase: 'apunte__titulo', texto: a.titulo }),
        meta
      ];
      var cuerpo;
      if (a.url) {
        cuerpo = crear('a', { clase: 'apunte', href: a.url }, contenido);
      } else {
        meta.appendChild(crear('span', { clase: 'insignia', texto: 'Próximamente' }));
        cuerpo = crear('div', { clase: 'apunte apunte--pendiente' }, contenido);
      }
      return crear('li', null, [cuerpo]);
    }

    function pintar() {
      $$('.chip', filtros).forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.curso === estado.curso ? 'true' : 'false');
      });

      var visibles = apuntes.filter(function (a) {
        var okCurso = estado.curso === 'Todos' || a.curso === estado.curso;
        if (!okCurso) return false;
        if (!estado.texto) return true;
        var pajar = normalizar([a.titulo, a.curso].concat(a.etiquetas || []).join(' '));
        return pajar.indexOf(estado.texto) !== -1;
      });

      lista.replaceChildren.apply(lista, visibles.map(fila));
      vacio.hidden = visibles.length > 0;
      contador.textContent = visibles.length + (visibles.length === 1 ? ' apunte' : ' apuntes');
    }

    pintar();
  }

  /* ---------- Curiosidades ---------- */

  function iniciarCuriosidades(datos) {
    var cont = $('#lista-curiosidades');
    if (!cont) return;
    cont.replaceChildren.apply(cont, datos.map(function (c) {
      return crear('article', { clase: 'curiosidad' }, [
        crear('p', { clase: 'curiosidad__dato', texto: c.dato }),
        crear('h3', { clase: 'curiosidad__titulo', texto: c.titulo }),
        crear('p', { clase: 'curiosidad__texto', texto: c.texto })
      ]);
    }));
  }

  /* ---------- Galería + visor ---------- */

  function medio(foto, enVisor) {
    if (foto.src) {
      return crear('img', {
        src: foto.src,
        alt: foto.pie + (foto.lugar ? ', ' + foto.lugar : ''),
        loading: enVisor ? 'eager' : 'lazy',
        decoding: 'async'
      });
    }
    return crear('div', { clase: 'hueco', 'aria-hidden': 'true' }, [
      crear('span', { texto: '[Foto: ' + foto.pie + ']' })
    ]);
  }

  function iniciarGaleria(fotos) {
    var galeria = $('#galeria');
    var visor = $('#visor');
    if (!galeria) return;

    galeria.replaceChildren.apply(galeria, fotos.map(function (f, i) {
      var boton = crear('button', {
        type: 'button',
        clase: 'foto foto--' + (f.forma || 'normal'),
        'aria-label': 'Ver foto: ' + f.pie
      }, [
        medio(f, false),
        crear('span', { clase: 'foto__pie' }, [
          crear('span', { texto: f.pie }),
          crear('span', { clase: 'foto__lugar', texto: f.lugar || '' })
        ])
      ]);
      boton.addEventListener('click', function () { abrir(i); });
      return boton;
    }));

    if (!visor || typeof visor.showModal !== 'function') return;

    var actual = 0;
    var imagen = $('#visor-imagen');
    var pie = $('#visor-pie');
    var posicion = $('#visor-posicion');

    function mostrar(i) {
      actual = (i + fotos.length) % fotos.length;
      var f = fotos[actual];
      imagen.replaceChildren(medio(f, true));
      pie.textContent = f.pie + (f.lugar ? ' · ' + f.lugar : '');
      posicion.textContent = (actual + 1) + ' / ' + fotos.length;
    }
    function abrir(i) { mostrar(i); visor.showModal(); }

    $('#visor-anterior').addEventListener('click', function () { mostrar(actual - 1); });
    $('#visor-siguiente').addEventListener('click', function () { mostrar(actual + 1); });
    $('#visor-cerrar').addEventListener('click', function () { visor.close(); });

    // Cerrar al hacer clic fuera del marco
    visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });

    // Flechas del teclado, solo mientras el visor está abierto
    visor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(actual - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(actual + 1); }
    });

    // Deslizar con el dedo en el celular
    var x0 = null;
    imagen.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    imagen.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) mostrar(actual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- Página de apunte: índice activo ---------- */

  function iniciarIndice() {
    var enlaces = $$('.indice a[href^="#"]');
    if (!enlaces.length || !('IntersectionObserver' in window)) return;

    var mapa = {};
    enlaces.forEach(function (a) { mapa[a.getAttribute('href').slice(1)] = a; });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        enlaces.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = mapa[en.target.id];
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    Object.keys(mapa).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) obs.observe(sec);
    });
  }

  /* ---------- Página de apunte: anterior / siguiente ---------- */

  function iniciarVecinos(datos) {
    var nav = $('#vecinos');
    if (!nav) return;
    var propia = nav.dataset.url;
    var ordenados = datos.slice().sort(function (a, b) { return b.fecha.localeCompare(a.fecha); });
    var i = ordenados.findIndex(function (a) { return a.url === propia; });
    if (i === -1) return;

    function tarjeta(a, rotulo, clase) {
      if (!a) return null;
      var hijos = [
        crear('span', { clase: 'vecino__rotulo', texto: rotulo }),
        crear('span', { clase: 'vecino__titulo', texto: a.titulo })
      ];
      return a.url
        ? crear('a', { clase: 'vecino ' + clase, href: '../' + a.url }, hijos)
        : crear('div', { clase: 'vecino vecino--pendiente ' + clase }, hijos.concat([crear('span', { clase: 'insignia', texto: 'Próximamente' })]));
    }
    // "Anterior" = más antiguo (abajo en la lista), "Siguiente" = más reciente
    var mas_reciente = ordenados[i - 1];
    var mas_antiguo = ordenados[i + 1];
    nav.replaceChildren.apply(nav, [
      tarjeta(mas_antiguo, '← Anterior', ''),
      tarjeta(mas_reciente, 'Siguiente →', 'vecino--derecha')
    ].filter(Boolean));
  }

  /* ---------- Arranque ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    var datos = window.SITIO || { apuntes: [], curiosidades: [], fotos: [] };

    iniciarTema();
    iniciarMenu();
    iniciarCopiar();

    var anio = $('#anio');
    if (anio) anio.textContent = new Date().getFullYear();

    if (document.body.dataset.pagina === 'inicio') {
      iniciarApuntes(datos.apuntes);
      iniciarCuriosidades(datos.curiosidades);
      iniciarGaleria(datos.fotos);
    }
    if (document.body.dataset.pagina === 'apunte') {
      iniciarIndice();
      iniciarVecinos(datos.apuntes);
    }
  });
})();
