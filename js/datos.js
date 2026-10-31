/* =========================================================================
   DATOS DEL SITIO
   Este es el único archivo que necesitas editar para agregar contenido.
   - Apuntes: agrega un objeto a la lista. Si tiene página propia, pon su
     ruta en `url` (por ejemplo "apuntes/mi-tema.html"). Si `url` está vacío,
     el apunte aparece como "Próximamente".
   - Fotos: copia la imagen a img/fotos/ y pon su ruta en `src`. Si `src`
     está vacío, se muestra un recuadro de ejemplo.
   - `fecha` va en formato AAAA-MM-DD. La lista se ordena sola, del más
     reciente al más antiguo.
   ========================================================================= */

window.SITIO = {

  apuntes: [
    {
      titulo: 'Espectrofotómetro: la calibración y las curiosidades de la luz',
      curso: 'Metrología',
      fecha: '2026-10-31',
      paginas: 5,
      etiquetas: ['Beer–Lambert', 'absorbancia', 'espectrofotometría'],
      url: 'apuntes/espectrofotometro.html',
      pdf: ''
    },
    {
      titulo: 'Metrología: la GUM, el paso a paso de la propagación',
      curso: 'Metrología',
      fecha: '2026-10-31',
      paginas: 5,
      etiquetas: ['GUM', 'incertidumbre', 'propagación'],
      url: 'apuntes/metrologia.html',
      pdf: ''
    },
    {
      titulo: 'Teoría de Ginzburg–Landau: longitudes $\\xi$ y $\\lambda$',
      curso: 'Estado sólido',
      fecha: '2026-10-05',
      paginas: 18,
      etiquetas: ['superconductividad', 'parámetro de orden', 'tipo I'],
      url: 'apuntes/ginzburg-landau.html',
      pdf: ''
    },
    {
      titulo: 'Oscilador armónico y operadores escalera',
      curso: 'Cuántica',
      fecha: '2026-10-12',
      paginas: 14,
      etiquetas: ['operadores', 'espectro'],
      url: '',
      pdf: ''
    },
    {
      titulo: 'Ensamble gran canónico y gas ideal de Bose',
      curso: 'Estadística',
      fecha: '2026-09-28',
      paginas: 11,
      etiquetas: ['condensación de Bose–Einstein'],
      url: '',
      pdf: ''
    },
    {
      titulo: 'Potenciales retardados y radiación dipolar',
      curso: 'Electrodinámica',
      fecha: '2026-09-21',
      paginas: 16,
      etiquetas: ['radiación', 'Liénard–Wiechert'],
      url: '',
      pdf: ''
    },
    {
      titulo: 'Diferencias finitas para la ecuación de Ginzburg–Landau dependiente del tiempo',
      curso: 'Numérico',
      fecha: '2026-09-14',
      paginas: 9,
      etiquetas: ['TDGL', 'discretización'],
      url: '',
      pdf: ''
    },
    {
      titulo: 'Transiciones de fase y exponentes críticos',
      curso: 'Estadística',
      fecha: '2026-09-07',
      paginas: 13,
      etiquetas: ['universalidad', 'Landau'],
      url: '',
      pdf: ''
    }
  ],

  curiosidades: [
    {
      dato: 'B = 0',
      titulo: 'Un imán que flota',
      texto: 'Por el efecto Meissner, un superconductor expulsa el campo magnético de su interior. Esa expulsión basta para mantener un imán suspendido encima.'
    },
    {
      dato: '7,2 K',
      titulo: 'El nitrógeno no alcanza para el plomo',
      texto: 'El nitrógeno líquido (77 K) enfría el YBCO, cuya temperatura crítica ronda los 92 K. El plomo, un superconductor tipo I, necesita bajar a 7,2 K, y para eso hace falta helio líquido.'
    },
    {
      dato: 'ΔT < 0',
      titulo: 'Enfriar quitando un campo',
      texto: 'Si desmagnetizas un material de forma adiabática, se enfría. Con esta técnica se llega a temperaturas de milikelvin.'
    },
    {
      dato: 'h',
      titulo: 'El kilogramo dejó de ser un objeto',
      texto: 'Desde 2019 el kilogramo se define fijando el valor de la constante de Planck, y ya no por un cilindro de platino e iridio guardado en Sèvres, cerca de París.'
    }
  ],

  /* -----------------------------------------------------------------------
     LIBROS
     - portada: ruta a una foto TUYA del libro (p. ej. 'img/libros/tinkham.jpg').
       Si está vacía, el sitio dibuja una portada propia con la ecuación del libro.
     - ecuacion: LaTeX dentro de String.raw`...` (así no hace falta duplicar \\).
     - estado: 'leido' | 'leyendo' | 'por-leer'.  progreso: 0 a 1 (solo 'leyendo').
     - comentario: tu reseña. Mientras esté vacío, aparece "Reseña pendiente".
     - curiosidades: textos cortos; aceptan LaTeX en línea con $...$ (con \\ doble).
     OJO: estado, progreso y comentario son de EJEMPLO: ponlos tú.
     ----------------------------------------------------------------------- */
  libros: [
    {
      titulo: 'Introduction to Superconductivity',
      autor: 'Michael Tinkham',
      anio: '1975 · 2.ª ed. 1996',
      categoria: 'Física',
      nivel: 'Posgrado',
      estado: 'leyendo',
      progreso: 0.45,
      portada: '',
      ecuacion: String.raw`2\Delta(0) \approx 3.53\,k_B \tc`,
      ecuacionNota: 'Relación BCS entre la brecha de energía a temperatura cero y la temperatura crítica.',
      comentario: '',
      curiosidades: [
        'Tinkham midió la brecha superconductora antes de que existiera la teoría que la explicaba: con Rolfe Glover vio en 1956–57 cómo películas delgadas dejaban de absorber radiación de infrarrojo lejano, justo antes de que se publicara BCS en 1957.',
        'Dover reeditó la segunda edición en 2004, y desde entonces es uno de los libros de posgrado más baratos que hay.',
        'Los capítulos de Ginzburg–Landau llevan a la red de vórtices que Abrikosov predijo en 1957: le dio el Nobel de 2003, compartido con Ginzburg y Leggett.'
      ]
    },
    {
      titulo: 'Classical Mechanics',
      autor: 'Herbert Goldstein, Charles Poole, John Safko',
      anio: '1950 · 3.ª ed. 2002',
      categoria: 'Física',
      nivel: 'Posgrado',
      estado: 'leido',
      progreso: 1,
      portada: '',
      ecuacion: String.raw`\dv{}{t}\left(\pdv{L}{\dot q_i}\right) - \pdv{L}{q_i} = 0`,
      ecuacionNota: 'Ecuaciones de Euler–Lagrange: toda la mecánica sale de extremar la acción.',
      comentario: '',
      curiosidades: [
        'Goldstein investigó de dónde venía el vector de Laplace–Runge–Lenz y lo rastreó hasta Jakob Hermann y Johann Bernoulli en 1710, más de un siglo antes de Laplace.',
        'Entre la segunda edición (1980) y la tercera (2002) pasaron 22 años. La tercera sumó a Charles Poole y John Safko como coautores.'
      ]
    },
    {
      titulo: 'Física estadística',
      autor: 'Lev Landau y Evgeny Lifshitz',
      anio: 'Curso de Física Teórica, vol. 5',
      categoria: 'Física',
      nivel: 'Posgrado',
      estado: 'por-leer',
      progreso: 0,
      portada: '',
      ecuacion: String.raw`F = F_0 + a\,(T - \tc)\,\eta^2 + b\,\eta^4`,
      ecuacionNota: 'Teoría de Landau de las transiciones de fase: la misma idea que luego usa Ginzburg–Landau con $\\psi$.',
      comentario: '',
      curiosidades: [
        'Para trabajar con Landau había que aprobar su "mínimo teórico", una serie de exámenes orales. Se suele citar que entre 1934 y 1961 solo 43 personas lo lograron.',
        'En enero de 1962 Landau sufrió un accidente de auto que acabó con su carrera. Ese mismo año recibió el Nobel por su teoría del helio líquido, y el Curso lo terminaron Lifshitz y Pitaevskii.'
      ]
    },
    {
      titulo: 'La medida de todas las cosas',
      autor: 'Ken Alder',
      anio: '2002',
      categoria: 'Historia de la ciencia',
      nivel: 'Divulgación',
      estado: 'por-leer',
      progreso: 0,
      portada: '',
      ecuacion: String.raw`1\ \mathrm{m} = c \cdot \frac{1\ \mathrm{s}}{299\,792\,458}`,
      ecuacionNota: 'Definición actual del metro. El libro cuenta la anterior: una diezmillonésima del cuarto de meridiano.',
      comentario: '',
      curiosidades: [
        'Entre 1792 y 1798, Delambre midió el meridiano hacia el norte desde Dunkerque y Méchain hacia el sur hasta Barcelona, en plena Revolución Francesa.',
        'Méchain encontró una discrepancia en su latitud de Barcelona y la ocultó durante años. El metro resultante quedó unos 0,2 mm más corto de lo que pretendía su definición.',
        'Es la historia de un error de medición, así que viene a ser un caso de estudio de incertidumbre tipo B.'
      ]
    },
    {
      titulo: '¿Está usted de broma, Sr. Feynman?',
      autor: 'Richard Feynman y Ralph Leighton',
      anio: '1985',
      categoria: 'Divulgación',
      nivel: 'Para cualquiera',
      estado: 'leido',
      progreso: 1,
      portada: '',
      ecuacion: String.raw`\omega_{\text{bamboleo}} = 2\,\omega_{\text{giro}}`,
      ecuacionNota: 'El plato que alguien lanzó en la cafetería de Cornell: Feynman notó que se bamboleaba al doble de rápido de lo que giraba.',
      comentario: '',
      curiosidades: [
        'El libro sale de conversaciones grabadas con Ralph Leighton, su compañero de tambores e hijo de Robert Leighton, coautor de las Lectures.',
        'En Los Álamos abría cajas fuertes con documentos secretos para demostrar lo mala que era la seguridad.',
        'Según él, jugar con la ecuación de ese plato giratorio, sin otro propósito que divertirse, lo devolvió a la física y terminó en el trabajo por el que ganó el Nobel.'
      ]
    },
    {
      titulo: 'Gödel, Escher, Bach',
      autor: 'Douglas Hofstadter',
      anio: '1979',
      categoria: 'Divulgación',
      nivel: 'Exigente',
      estado: 'por-leer',
      progreso: 0,
      portada: '',
      ecuacion: String.raw`G \;\leftrightarrow\; \neg\,\mathrm{Dem}(\ulcorner G \urcorner)`,
      ecuacionNota: 'La oración de Gödel: afirma de sí misma que no se puede demostrar.',
      comentario: '',
      curiosidades: [
        'Ganó el Premio Pulitzer de no ficción en 1980.',
        'Los diálogos entre Aquiles y la Tortuga que separan los capítulos toman sus personajes de un texto de Lewis Carroll de 1895, "Lo que la Tortuga le dijo a Aquiles".'
      ]
    },

    /* ---------- Literatura ----------
       En lugar de ecuación, la tapa lleva un motivo dibujado:
       'sol' | 'mariposas' | 'hexagonos' | 'marca' | 'galones'.
       `resumen` aparece en la ficha como "De qué va". `ecuacion` es opcional. */
    {
      titulo: 'Caín',
      autor: 'José Saramago',
      anio: '2009',
      categoria: 'Literatura',
      nivel: 'Novela',
      estado: 'leido',
      progreso: 1,
      portada: '',
      motivo: 'marca',
      resumen: 'Caín, condenado a vagar después de matar a su hermano, salta de un episodio a otro del Antiguo Testamento y le discute a Dios cada una de sus decisiones.',
      comentario: '',
      curiosidades: [
        'Fue la última novela que Saramago publicó en vida: murió en junio de 2010.',
        'Escribe los diálogos sin guiones ni comillas. Solo una coma y una mayúscula avisan que habla otro personaje.',
        'En 1998 fue el primer escritor en lengua portuguesa en ganar el Nobel de Literatura.'
      ]
    },
    {
      titulo: 'El extranjero',
      autor: 'Albert Camus',
      anio: '1942',
      categoria: 'Literatura',
      nivel: 'Novela',
      estado: 'leido',
      progreso: 1,
      portada: '',
      motivo: 'sol',
      resumen: 'Meursault, un empleado de Argel, mata a un hombre en una playa bajo un sol que lo ciega. En el juicio pesa tanto el crimen como el hecho de no haber llorado en el entierro de su madre.',
      comentario: '',
      curiosidades: [
        'Se publicó en 1942, en la Francia ocupada por Alemania.',
        'Camus recibió el Nobel en 1957, a los 44 años. Murió en un accidente de auto en enero de 1960 con un boleto de tren sin usar en el bolsillo.',
        'En 2013, Kamel Daoud publicó "Meursault, contra-investigación", que cuenta la historia desde el hermano del hombre asesinado, que en la novela de Camus ni siquiera tiene nombre.'
      ]
    },
    {
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez',
      anio: '1967',
      categoria: 'Literatura',
      nivel: 'Novela',
      estado: 'por-leer',
      progreso: 0,
      portada: '',
      motivo: 'mariposas',
      resumen: 'Siete generaciones de los Buendía en Macondo, desde la fundación del pueblo hasta su final.',
      comentario: '',
      curiosidades: [
        'García Márquez no tenía dinero para enviar todo el manuscrito a la editorial Sudamericana, en Buenos Aires, así que mandó primero solo la mitad.',
        'Recibió el Nobel en 1982. En 2024 Netflix estrenó la primera adaptación, después de décadas en que el autor se negó a vender los derechos para cine.'
      ]
    },
    {
      titulo: 'La ciudad y los perros',
      autor: 'Mario Vargas Llosa',
      anio: '1963',
      categoria: 'Literatura',
      nivel: 'Novela',
      estado: 'por-leer',
      progreso: 0,
      portada: '',
      motivo: 'galones',
      resumen: 'Cadetes del Colegio Militar Leoncio Prado, en Lima, entre la violencia, los códigos de silencio y un robo que termina en una muerte.',
      comentario: '',
      curiosidades: [
        'Ganó el Premio Biblioteca Breve de Seix Barral en 1962, cuando aún era un manuscrito inédito.',
        'Vargas Llosa estudió en el Leoncio Prado. Él mismo contaba que en el colegio quemaron ejemplares del libro.',
        'Recibió el Nobel de Literatura en 2010.'
      ]
    },
    {
      titulo: 'Ficciones',
      autor: 'Jorge Luis Borges',
      anio: '1944',
      categoria: 'Literatura',
      nivel: 'Cuentos',
      estado: 'por-leer',
      progreso: 0,
      portada: '',
      motivo: 'hexagonos',
      resumen: 'Cuentos de laberintos, bibliotecas infinitas y mundos que se bifurcan, entre ellos "La biblioteca de Babel" y "El jardín de senderos que se bifurcan".',
      ecuacion: String.raw`N = 25^{\,410\cdot 40\cdot 80} = 25^{1\,312\,000} \approx 1.96\times10^{1\,834\,097}`,
      ecuacionNota: 'Libros distintos en la Biblioteca de Babel: 410 páginas, 40 renglones de 80 letras y 25 símbolos posibles en cada lugar.',
      comentario: '',
      curiosidades: [
        'Si cada libro de la Biblioteca de Babel fuera un átomo, el universo observable (unos $10^{80}$ átomos) no alcanzaría ni para una fracción despreciable de ellos.',
        '"El jardín de senderos que se bifurcan" (1941) se suele citar como un anticipo literario de la interpretación de muchos mundos de Everett (1957).'
      ]
    }
  ],

  // forma: 'normal' | 'ancha' | 'alta' | 'grande'
  /* -----------------------------------------------------------------------
     FOTOS ("Bitácora")
     - src: ruta a la foto en img/fotos/ (vacío = recuadro de ejemplo).
     - titulo, lugar, fecha: lo que se ve bajo la foto.
     - coleccion: agrupa las fotos (los botones de filtro salen de aquí).
     - resena: tu texto sobre la foto. Separa párrafos con una línea en
       blanco (\n\n). Acepta LaTeX en línea con $...$ (con \\ doble).
     - destacada: true para que esa foto abra la sección en grande.
       Si ninguna lo está, se destaca la primera.
     - tecnica (opcional): cámara o ajustes, p. ej. 'f/2.8 · 1/250 s · ISO 400'.
     OJO: las reseñas son de EJEMPLO. Escríbelas tú con lo que viviste.
     ----------------------------------------------------------------------- */
  fotos: [
    {
      src: '', titulo: 'Horno de sinterizado', lugar: 'UNMSM', fecha: '2026', coleccion: 'Laboratorio', destacada: true,
      resena: 'Aquí las muestras cerámicas pasan horas por encima de los mil grados. El sinterizado une los granos del polvo compactado sin llegar a fundirlo, y de esa rampa de temperatura depende casi todo lo que después mide el laboratorio.\n\nEs la parte del trabajo que no sale en los artículos: programar el horno, esperar y abrirlo con cuidado al día siguiente.'
    },
    {
      src: '', titulo: 'Muestras listas para medir', lugar: 'Lab. de Cerámicos y Nanomateriales', fecha: '2026', coleccion: 'Laboratorio',
      resena: 'Pastillas recién salidas del horno, etiquetadas y esperando su turno. A simple vista son todas iguales; las diferencias aparecen recién en las mediciones.'
    },
    {
      src: '', titulo: 'Pizarra del lunes', lugar: 'Facultad de Ciencias Físicas', fecha: '2026', coleccion: 'Laboratorio',
      resena: 'Lo que quedó en la pizarra después de clase. Antes de que la borren, una foto es la forma más rápida de guardar la demostración completa, con flechas y correcciones incluidas.'
    },
    {
      src: '', titulo: 'Póster en el congreso', lugar: '[Ciudad]', fecha: '2026', coleccion: 'Laboratorio',
      resena: 'Meses de simulaciones resumidos en un póster. [Cuenta aquí de qué trató y qué preguntas te hicieron.]'
    },
    {
      src: '', titulo: 'Atardecer en la Costa Verde', lugar: 'Lima', fecha: '2026', coleccion: 'Lima',
      resena: 'Desde los acantilados el sol se hunde en el Pacífico. En invierno la neblina casi nunca lo deja ver; en verano es el espectáculo de casi todas las tardes.'
    },
    {
      src: '', titulo: 'Centro histórico', lugar: 'Lima', fecha: '2026', coleccion: 'Lima',
      resena: 'Balcones de madera, iglesias coloniales y el ruido de siempre. El Centro Histórico de Lima es Patrimonio de la Humanidad desde 1988.'
    },
    {
      src: '', titulo: 'Barranco de noche', lugar: 'Lima', fecha: '2026', coleccion: 'Lima',
      resena: 'El Puente de los Suspiros con sus faroles encendidos. Dicen que si lo cruzas por primera vez aguantando la respiración, se cumple un deseo.'
    },
    {
      src: '', titulo: 'Salida de campo', lugar: '[Lugar]', fecha: '2026', coleccion: 'Viajes',
      resena: 'Una jornada lejos del laboratorio. [Cuenta adónde fueron y qué encontraron.]'
    },
    {
      src: '', titulo: 'Laguna de altura', lugar: '[Lugar]', fecha: '2026', coleccion: 'Viajes',
      resena: 'Ese turquesa no es un filtro. Las lagunas glaciares llevan en suspensión partículas finísimas de roca, la llamada harina glaciar, que dispersan la luz y le dan al agua su color.'
    },
    {
      src: '', titulo: 'Camino de regreso', lugar: '[Lugar]', fecha: '2026', coleccion: 'Viajes',
      resena: 'La última foto del viaje, tomada por la ventana cuando ya se vuelve a casa.'
    }
  ]
};
