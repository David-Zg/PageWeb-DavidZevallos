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
      if (window.renderLatex) window.renderLatex(lista);
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

  /* ---------- Fotos: bitácora ---------- */

  function dosDigitos(n) { return String(n).padStart(2, '0'); }

  // Posiciones de la luz en los recuadros de ejemplo, para que no se vean todos iguales
  var LUCES = [['78%', '22%'], ['22%', '30%'], ['65%', '75%'], ['30%', '70%'], ['50%', '20%']];

  // La foto, o un recuadro de ejemplo mientras no haya archivo
  function medio(foto, i, enGrande) {
    if (foto.src) {
      return crear('img', {
        src: foto.src,
        alt: foto.titulo + (foto.lugar ? ', ' + foto.lugar : ''),
        loading: enGrande ? 'eager' : 'lazy',
        decoding: 'async'
      });
    }
    var vacia = crear('span', { clase: 'foto-vacia', 'aria-hidden': 'true' });
    vacia.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
    vacia.appendChild(crear('span', { texto: 'Aquí va tu foto' }));
    var luz = LUCES[i % LUCES.length];
    vacia.style.setProperty('--luz-x', luz[0]);
    vacia.style.setProperty('--luz-y', luz[1]);
    return vacia;
  }

  // Una impresión: la foto con su margen y la anotación a mano
  function impresion(foto, i, opciones) {
    opciones = opciones || {};
    return crear(opciones.etiqueta || 'span', { clase: 'impresion' + (opciones.clase ? ' ' + opciones.clase : '') }, [
      crear('span', { clase: 'impresion__foto' }, [medio(foto, i, opciones.grande)]),
      crear('span', { clase: 'impresion__nota', 'aria-hidden': 'true', texto: foto.titulo })
    ]);
  }

  function parrafos(texto, clase) {
    return String(texto || '').trim().split(/\n\s*\n/).filter(Boolean).map(function (t) {
      return crear('p', { clase: clase, texto: t });
    });
  }

  function metaFoto(f) { return [f.lugar, f.fecha].filter(Boolean).join(' · '); }

  function iniciarGaleria(fotos) {
    var hojas = $('#hojas');
    var destacada = $('#foto-destacada');
    if (!hojas || !destacada || !fotos || !fotos.length) return;
    var filtros = $('#filtros-fotos');
    var contador = $('#contador-fotos');

    var todas = fotos.map(function (f, i) { return { foto: f, n: i }; });
    var visibles = todas;

    var colecciones = ['Todas'];
    fotos.forEach(function (f) { if (f.coleccion && colecciones.indexOf(f.coleccion) === -1) colecciones.push(f.coleccion); });
    var filtro = leer('filtro-fotos') || 'Todas';
    if (colecciones.indexOf(filtro) === -1) filtro = 'Todas';

    if (colecciones.length > 2) {
      colecciones.forEach(function (c) {
        var b = crear('button', { type: 'button', clase: 'chip chip--claro', 'data-col': c, texto: c });
        b.addEventListener('click', function () { filtro = c; guardar('filtro-fotos', c); pintar(); });
        filtros.appendChild(b);
      });
    } else {
      filtros.hidden = true;
    }

    function pintarDestacada(item) {
      var f = item.foto;
      var boton = crear('button', { type: 'button', clase: 'destacada__boton', 'aria-label': 'Ver en grande: ' + f.titulo }, [
        impresion(f, item.n, { clase: 'impresion--destacada', grande: true })
      ]);
      boton.addEventListener('click', function () { abrir(0); });
      var ver = crear('button', { type: 'button', clase: 'boton boton--borde boton--chico' }, ['Ver en grande']);
      ver.addEventListener('click', function () { abrir(0); });
      destacada.replaceChildren(
        crear('div', { clase: 'destacada__foto' }, [boton]),
        crear('div', { clase: 'destacada__texto' }, [
          crear('p', { clase: 'etiqueta', texto: 'Nº ' + dosDigitos(item.n + 1) + (f.coleccion ? ' · ' + f.coleccion : '') }),
          crear('h3', { clase: 'destacada__titulo', texto: f.titulo }),
          crear('p', { clase: 'destacada__meta', texto: metaFoto(f) }),
          crear('div', { clase: 'destacada__resena' }, parrafos(f.resena, 'resena')),
          crear('div', { clase: 'acciones' }, [ver])
        ])
      );
    }

    function hoja(item, posicion) {
      var f = item.foto;
      var b = crear('button', { type: 'button', clase: 'hoja', 'aria-label': 'Ver foto y reseña: ' + f.titulo }, [
        impresion(f, item.n),
        crear('span', { clase: 'hoja__texto' }, [
          crear('span', { clase: 'hoja__meta', texto: 'Nº ' + dosDigitos(item.n + 1) + ' · ' + metaFoto(f) }),
          crear('span', { clase: 'hoja__titulo', texto: f.titulo }),
          f.resena ? crear('span', { clase: 'hoja__resena', texto: String(f.resena).split(/\n\s*\n/)[0] }) : null,
          crear('span', { clase: 'hoja__leer', texto: 'Leer la reseña →' })
        ])
      ]);
      b.addEventListener('click', function () { abrir(posicion); });
      return crear('li', null, [b]);
    }

    function pintar() {
      $$('.chip', filtros).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.col === filtro ? 'true' : 'false'); });
      var lista = todas.filter(function (it) { return filtro === 'Todas' || it.foto.coleccion === filtro; });
      // La destacada abre la lista; si en este filtro no hay ninguna marcada, va la primera
      var k = lista.findIndex(function (it) { return it.foto.destacada; });
      if (k > 0) lista.unshift(lista.splice(k, 1)[0]);
      visibles = lista;

      pintarDestacada(lista[0]);
      hojas.replaceChildren.apply(hojas, lista.slice(1).map(function (it, j) { return hoja(it, j + 1); }));
      hojas.hidden = lista.length < 2;
      contador.textContent = lista.length + (lista.length === 1 ? ' foto' : ' fotos') +
        (filtro === 'Todas' && colecciones.length > 1 ? ' · ' + (colecciones.length - 1) + ' colecciones' : '');
      if (window.renderLatex) { window.renderLatex(destacada); window.renderLatex(hojas); }
    }

    /* --- Visor --- */
    var visor = $('#visor-foto');
    var actual = 0;

    function rellenar(i) {
      actual = (i + visibles.length) % visibles.length;
      var item = visibles[actual], f = item.foto;
      var fig = $('#visor-foto-impresion');
      var nueva = impresion(f, item.n, { grande: true });
      fig.replaceChildren.apply(fig, Array.prototype.slice.call(nueva.childNodes));
      fig.classList.remove('cambiando'); void fig.offsetWidth; fig.classList.add('cambiando');
      $('#visor-foto-num').textContent = 'Nº ' + dosDigitos(item.n + 1) + (f.coleccion ? ' · ' + f.coleccion : '');
      $('#visor-foto-titulo').textContent = f.titulo;
      $('#visor-foto-meta').textContent = metaFoto(f);
      var res = $('#visor-foto-resena');
      res.replaceChildren.apply(res, f.resena ? parrafos(f.resena, 'resena') : [crear('p', { clase: 'resena resena--pendiente', texto: 'Todavía no escribo la reseña de esta foto.' })]);
      var tec = $('#visor-foto-tecnica');
      tec.hidden = !f.tecnica; tec.textContent = f.tecnica || '';
      $('#visor-foto-posicion').textContent = (actual + 1) + ' / ' + visibles.length;
      $('.visor-foto__texto', visor).scrollTop = 0;
      if (window.renderLatex) window.renderLatex(res);
      [actual + 1, actual - 1].forEach(function (j) {
        var g = visibles[(j + visibles.length) % visibles.length].foto;
        if (g.src) { var im = new Image(); im.src = g.src; }
      });
    }

    function abrir(i) {
      rellenar(i);
      if (visor && typeof visor.showModal === 'function' && !visor.open) visor.showModal();
    }

    if (visor) {
      $('#visor-foto-anterior').addEventListener('click', function () { rellenar(actual - 1); });
      $('#visor-foto-siguiente').addEventListener('click', function () { rellenar(actual + 1); });
      $('#visor-foto-cerrar').addEventListener('click', function () { visor.close(); });
      visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });
      visor.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); rellenar(actual - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); rellenar(actual + 1); }
      });
      var x0 = null, lamina = $('.visor-foto__lamina', visor);
      lamina.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      lamina.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) rellenar(actual + (dx < 0 ? 1 : -1));
        x0 = null;
      });
    }

    pintar();
  }

  /* ---------- Libros ---------- */

  // Tonos de las portadas generadas (se asignan en orden; un libro puede
  // fijar el suyo con `color: '#123456'` en datos.js)
  var TONOS = ['#1F3A8A', '#8A4B12', '#1E5E57', '#5B2A6E', '#2E3A48', '#6B2B2B'];

  var ESTADOS = {
    'leido': 'Leído',
    'leyendo': 'Leyendo',
    'por-leer': 'Por leer'
  };

  // Motivos dibujados para las tapas de literatura (trazos simples, propios)
  var MOTIVOS = {
    sol: (function () {
      var r = '<circle cx="50" cy="50" r="15" fill="currentColor" stroke="none"/>';
      for (var k = 0; k < 16; k++) {
        var a = k * Math.PI / 8, l = k % 2 ? 34 : 40;
        r += '<line x1="' + (50 + 22 * Math.cos(a)).toFixed(1) + '" y1="' + (50 + 22 * Math.sin(a)).toFixed(1) +
             '" x2="' + (50 + l * Math.cos(a)).toFixed(1) + '" y2="' + (50 + l * Math.sin(a)).toFixed(1) + '"/>';
      }
      return r;
    })(),
    mariposas: (function () {
      function m(x, y, s, g) {
        return '<g transform="translate(' + x + ' ' + y + ') rotate(' + g + ') scale(' + s + ')">' +
          '<path d="M0 0C-6-14-20-12-16-2C-13 5-5 4 0 0Z" fill="currentColor" stroke="none"/>' +
          '<path d="M0 0C6-14 20-12 16-2C13 5 5 4 0 0Z" fill="currentColor" stroke="none"/>' +
          '<path d="M0 0C-4 6-12 12-10 4M0 0C4 6 12 12 10 4" />' +
          '<path d="M0-1V-7" /></g>';
      }
      return m(36, 40, 1.15, -12) + m(64, 30, 0.75, 14) + m(60, 66, 0.95, 6) + m(28, 70, 0.55, -20);
    })(),
    hexagonos: (function () {
      function h(cx, cy, r) {
        var p = [];
        for (var k = 0; k < 6; k++) { var a = Math.PI / 6 + k * Math.PI / 3; p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
        return '<polygon points="' + p.join(' ') + '"/>';
      }
      var r = 12, dx = r * Math.sqrt(3), out = h(50, 50, r);
      for (var k = 0; k < 6; k++) { var a = k * Math.PI / 3; out += h(50 + dx * Math.cos(a), 50 + dx * Math.sin(a), r); }
      return out + '<circle cx="50" cy="50" r="2.4" fill="currentColor" stroke="none"/>';
    })(),
    marca: '<circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="22" stroke-dasharray="2 4"/>' +
           '<path d="M42 36L58 64M50 32V68M58 36L42 64" stroke-width="3"/>',
    galones: '<path d="M26 34L50 48L74 34"/><path d="M26 48L50 62L74 48"/><path d="M26 62L50 76L74 62"/>' +
             '<circle cx="50" cy="22" r="4" fill="currentColor" stroke="none"/>'
  };

  function motivoSVG(nombre) {
    var cuerpo = MOTIVOS[nombre];
    if (!cuerpo) return null;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = cuerpo;
    return svg;
  }

  function portadaLibro(libro, i) {
    if (libro.portada) {
      return crear('div', { clase: 'tapa tapa--foto' }, [
        crear('img', { src: libro.portada, alt: 'Portada de ' + libro.titulo, loading: 'lazy', decoding: 'async' })
      ]);
    }
    var literatura = libro.categoria === 'Literatura';
    var centro;
    var dibujo = libro.motivo ? motivoSVG(libro.motivo) : null;
    if (dibujo) {
      centro = crear('div', { clase: 'tapa__motivo', 'aria-hidden': 'true' }, [dibujo]);
    } else {
      centro = crear('div', { clase: 'tapa__ecuacion', 'aria-hidden': 'true' });
      if (libro.ecuacion && window.renderTex) window.renderTex(libro.ecuacion, centro, true);
    }
    var ecuacion = centro;
    var portada = crear('div', { clase: 'tapa' + (literatura ? ' tapa--literatura' : ''), 'aria-hidden': 'true' }, [
      crear('div', { clase: 'tapa__serie' }, [
        crear('span', { texto: 'Biblioteca' }),
        crear('span', { texto: 'Nº ' + String(i + 1).padStart(2, '0') })
      ]),
      ecuacion,
      crear('div', { clase: 'tapa__pie' }, [
        crear('p', { clase: 'tapa__titulo', texto: libro.titulo }),
        crear('p', { clase: 'tapa__autor', texto: libro.autor })
      ])
    ]);
    portada.style.setProperty('--tono', libro.color || TONOS[i % TONOS.length]);
    return portada;
  }

  function estadoLibro(libro) {
    var est = libro.estado || 'por-leer';
    var texto = ESTADOS[est] || est;
    var pastilla = crear('span', { clase: 'estado estado--' + est, texto: texto });
    if (est !== 'leyendo') return pastilla;
    var pct = Math.round(Math.max(0, Math.min(1, libro.progreso || 0)) * 100);
    pastilla.textContent = texto + ' · ' + pct + ' %';
    var barra = crear('span', {
      clase: 'estado__barra', role: 'progressbar',
      'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct),
      'aria-label': 'Avance de lectura'
    }, [crear('span')]);
    barra.firstChild.style.width = pct + '%';
    return crear('span', { clase: 'estado-caja' }, [pastilla, barra]);
  }

  // Achica la ecuación y el título de cada tapa hasta que quepan en su ancho
  function ajustarEcuaciones(raiz) {
    $$('.tapa__ecuacion', raiz).forEach(function (caja) {
      var k = caja.querySelector('.katex');
      if (!k) return;
      k.style.fontSize = '';
      var disponible = caja.clientWidth - 4;
      var html = k.querySelector('.katex-html') || k;
      var ancho = html.scrollWidth;
      if (disponible > 0 && ancho > disponible) {
        k.style.fontSize = (disponible / ancho).toFixed(3) + 'em';
      }
    });
    $$('.tapa__titulo', raiz).forEach(function (t) {
      t.style.fontSize = '';
      if (!t.clientWidth) return;
      var tam = parseFloat(getComputedStyle(t).fontSize), vueltas = 0;
      while (t.scrollWidth > t.clientWidth + 1 && tam > 9 && vueltas < 30) {
        tam -= 0.5; vueltas++;
        t.style.fontSize = tam + 'px';
      }
    });
  }

  function iniciarLibros(libros) {
    var estante = $('#estante');
    if (!estante || !libros || !libros.length) return;
    var filtros = $('#filtros-libros');
    var contador = $('#contador-libros');

    // El número de cada libro (Nº 01…) es fijo, aunque se filtre la lista
    var todos = libros.map(function (l, i) { return { libro: l, n: i }; });
    var visibles = todos;

    var cats = ['Todos'];
    libros.forEach(function (l) { if (l.categoria && cats.indexOf(l.categoria) === -1) cats.push(l.categoria); });
    var filtro = leer('filtro-libros') || 'Todos';
    if (cats.indexOf(filtro) === -1) filtro = 'Todos';

    cats.forEach(function (c) {
      var b = crear('button', { type: 'button', clase: 'chip chip--claro', 'data-cat': c, texto: c });
      b.addEventListener('click', function () { filtro = c; guardar('filtro-libros', c); pintar(); });
      filtros.appendChild(b);
    });

    function tarjeta(item, posicion) {
      var l = item.libro;
      var boton = crear('button', {
        type: 'button', clase: 'libro',
        'aria-label': 'Ver ficha de ' + l.titulo + ', de ' + l.autor
      }, [
        portadaLibro(l, item.n),
        crear('span', { clase: 'libro__info' }, [
          crear('span', { clase: 'libro__titulo', texto: l.titulo }),
          crear('span', { clase: 'libro__autor', texto: l.autor + (l.anio ? ' · ' + l.anio : '') }),
          estadoLibro(l)
        ])
      ]);
      boton.addEventListener('click', function () { abrir(posicion); });
      return crear('li', null, [boton]);
    }

    function pintar() {
      $$('.chip', filtros).forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.cat === filtro ? 'true' : 'false');
      });
      visibles = todos.filter(function (it) { return filtro === 'Todos' || it.libro.categoria === filtro; });
      estante.replaceChildren.apply(estante, visibles.map(tarjeta));
      ajustarEcuaciones(estante);
      var leidos = visibles.filter(function (it) { return it.libro.estado === 'leido'; }).length;
      contador.textContent = visibles.length + (visibles.length === 1 ? ' libro' : ' libros') + ' · ' + leidos + (leidos === 1 ? ' leído' : ' leídos');
    }

    /* --- Ficha (diálogo) --- */
    var ficha = $('#ficha-libro');
    var actual = 0;

    function rellenar(i) {
      actual = (i + visibles.length) % visibles.length;
      var item = visibles[actual], l = item.libro;

      $('#ficha-libro-portada').replaceChildren(portadaLibro(l, item.n));
      $('#ficha-libro-meta').textContent = [l.categoria, l.nivel, l.anio].filter(Boolean).join(' · ');
      $('#ficha-libro-titulo').textContent = l.titulo;
      $('#ficha-libro-autor').textContent = l.autor;
      $('#ficha-libro-estado').replaceChildren(estadoLibro(l));

      var com = $('#ficha-libro-comentario');
      if (l.comentario && l.comentario.trim()) {
        com.replaceChildren.apply(com, l.comentario.trim().split(/\n\s*\n/).map(function (p) {
          return crear('p', { clase: 'ficha-libro__comentario', texto: p });
        }));
      } else {
        com.replaceChildren(crear('p', { clase: 'ficha-libro__pendiente', texto: 'Reseña pendiente: todavía no escribo mi opinión sobre este libro.' }));
      }

      var cur = $('#ficha-libro-curiosas');
      cur.replaceChildren.apply(cur, (l.curiosidades || []).map(function (t) { return crear('li', { texto: t }); }));

      var ec = $('#ficha-libro-ecuacion');
      $('#ficha-libro-bloque-ecuacion').hidden = !l.ecuacion;
      if (l.ecuacion && window.renderTex) window.renderTex(l.ecuacion, ec, true);
      else ec.textContent = l.ecuacion || '';
      $('#ficha-libro-nota').textContent = l.ecuacionNota || '';

      $('#ficha-libro-bloque-resumen').hidden = !l.resumen;
      $('#ficha-libro-resumen').textContent = l.resumen || '';

      $('#libro-posicion').textContent = (actual + 1) + ' / ' + visibles.length;
      if (ficha && ficha.open) ajustarEcuaciones($('#ficha-libro-portada'));
      if (window.renderLatex) { window.renderLatex(cur); window.renderLatex($('#ficha-libro-nota')); window.renderLatex(com); }
    }

    function abrir(i) {
      rellenar(i);
      if (ficha && typeof ficha.showModal === 'function') {
        if (!ficha.open) ficha.showModal();
        ajustarEcuaciones($('#ficha-libro-portada'));
        $('.ficha-libro__marco', ficha).scrollTop = 0;
      }
    }

    if (ficha) {
      $('#libro-anterior').addEventListener('click', function () { rellenar(actual - 1); });
      $('#libro-siguiente').addEventListener('click', function () { rellenar(actual + 1); });
      $('#libro-cerrar').addEventListener('click', function () { ficha.close(); });
      ficha.addEventListener('click', function (e) { if (e.target === ficha) ficha.close(); });
      ficha.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); rellenar(actual - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); rellenar(actual + 1); }
      });
    }

    /* --- Dato al azar --- */
    var botonAzar = $('#dato-azar');
    var caja = $('#dato-azar-caja');
    var ultimo = null;
    if (botonAzar && caja) {
      var bolsa = [];
      libros.forEach(function (l, i) {
        (l.curiosidades || []).forEach(function (t) { bolsa.push({ texto: t, libro: i }); });
      });
      botonAzar.addEventListener('click', function () {
        if (!bolsa.length) return;
        var elegido;
        do { elegido = bolsa[Math.floor(Math.random() * bolsa.length)]; }
        while (bolsa.length > 1 && elegido === ultimo);
        ultimo = elegido;
        var l = libros[elegido.libro];
        $('#dato-azar-texto').textContent = elegido.texto;
        var fuente = $('#dato-azar-fuente');
        var ver = crear('button', { type: 'button', clase: 'enlace-boton', texto: 'Ver la ficha' });
        ver.addEventListener('click', function () {
          if (filtro !== 'Todos' && l.categoria !== filtro) { filtro = 'Todos'; guardar('filtro-libros', filtro); pintar(); }
          var pos = visibles.findIndex(function (it) { return it.n === elegido.libro; });
          abrir(pos);
        });
        fuente.replaceChildren('De «' + l.titulo + '», ' + l.autor + '. ', ver);
        caja.hidden = false;
        botonAzar.lastChild.textContent = ' Otro dato';
        if (window.renderLatex) window.renderLatex(caja);
      });
    }

    pintar();

    // Reajustar si cambia el ancho o cuando terminan de cargar las fuentes
    var espera;
    window.addEventListener('resize', function () {
      clearTimeout(espera);
      espera = setTimeout(function () { ajustarEcuaciones(estante); }, 150);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ajustarEcuaciones(estante); });
    }
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
      iniciarLibros(datos.libros);
      iniciarGaleria(datos.fotos);
    }
    if (document.body.dataset.pagina === 'apunte') {
      iniciarIndice();
      iniciarVecinos(datos.apuntes);
    }

    // LaTeX: todo el documento, una vez creadas las listas
    if (window.renderLatex) window.renderLatex(document.body);
  });
})();
