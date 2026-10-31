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
      titulo: 'Metrología: [tema de la clase]',
      curso: 'Metrología',
      fecha: '2026-10-31',
      paginas: 1,
      etiquetas: [],
      url: 'apuntes/metrologia.html',
      pdf: ''
    },
    {
      titulo: 'Teoría de Ginzburg–Landau: longitudes ξ y λ',
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

  // forma: 'normal' | 'ancha' | 'alta' | 'grande'
  fotos: [
    { src: '', pie: 'Horno de sinterizado', lugar: 'UNMSM', forma: 'grande' },
    { src: '', pie: 'Muestras listas', lugar: 'Laboratorio', forma: 'normal' },
    { src: '', pie: 'Pizarra del lunes', lugar: 'Aula', forma: 'alta' },
    { src: '', pie: 'Póster en congreso', lugar: '2026', forma: 'normal' },
    { src: '', pie: 'Atardecer en la Costa Verde', lugar: 'Lima', forma: 'ancha' },
    { src: '', pie: 'Salida de campo', lugar: 'Sierra', forma: 'ancha' }
  ]
};
