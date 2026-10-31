# Web personal de David Zevallos

El sitio está hecho con HTML, CSS y JavaScript puros, sin frameworks ni paso de compilación. Las ecuaciones se escriben en **LaTeX** directamente en el HTML y las dibuja **KaTeX**, que viene copiado en `vendor/katex/`. Por eso funciona sin internet y no depende de ningún CDN.

## Estructura

```
web-david/
├── index.html                  Inicio: portada, apuntes, curiosidades, libros, fotos, sobre mí
├── apuntes/
│   └── ginzburg-landau.html    Ejemplo de página de apunte (cópiala para cada apunte nuevo)
├── css/styles.css              Todo el diseño, con tema claro y oscuro
├── js/datos.js                 ← LO ÚNICO QUE EDITAS para agregar apuntes, curiosidades y fotos
├── apuntes/_plantilla.html     Plantilla vacía con ejemplos de LaTeX: cópiala para cada apunte
├── js/latex.js                 Configuración de LaTeX y macros de física
├── js/main.js                  Filtros, búsqueda, visor de fotos, tema, menú móvil
├── vendor/katex/               KaTeX 0.16.11 (no lo toques)
├── img/fotos/                  Aquí van tus fotos (sección "Bitácora de fotos")
├── img/libros/                 Fotos de tus libros (opcional)
└── pdf/                        Aquí van los PDF escaneados de tus apuntes
```

## Verlo en tu computadora

Abre `index.html` con doble clic. Funciona sin servidor, porque los datos se cargan como script y no con `fetch`.

## Agregar un apunte

1. Copia `apuntes/_plantilla.html` con otro nombre, por ejemplo `apuntes/oscilador-armonico.html`. Ya trae ecuaciones de ejemplo.
2. Reemplaza lo que está entre corchetes. Los comentarios `<!-- -->` indican qué cambiar. En `data-url`, pon la ruta del archivo.
3. En `js/datos.js`, agrega el apunte a la lista `apuntes`, o pon la ruta en `url` si ya estaba listado:

```js
{
  titulo: 'Oscilador armónico y operadores escalera',
  curso: 'Cuántica',
  fecha: '2026-10-12',
  paginas: 14,
  etiquetas: ['operadores', 'espectro'],
  url: 'apuntes/oscilador-armonico.html',
  pdf: 'pdf/oscilador-armonico.pdf'
}
```

Los botones de filtro por curso se generan solos a partir del campo `curso`. La lista se ordena sola por fecha.

## Escribir ecuaciones en LaTeX

Escribes LaTeX tal cual dentro del HTML:

| Qué | Cómo |
|---|---|
| En línea | `$E = mc^2$` o `\( E = mc^2 \)` |
| En bloque | `$$ \nabla\cdot\vb{B} = 0 $$` o `\[ ... \]` |
| Numerada | `$$ ... \tag{3} $$` |
| Varias líneas alineadas | `$$ \begin{aligned} a &= b \\ c &= d \end{aligned} $$` |
| Signo de dólar literal | `\$` |

Para que una ecuación salga en su recuadro, envuélvela en `<div class="ecuacion">`:

```html
<div class="ecuacion">
  $$ \xi(T) = \frac{\hbar}{\sqrt{2m^*\abs{\alpha(T)}}} \tag{2} $$
</div>
```

**Dos cuidados:**
- **Menor y mayor que:** dentro del HTML escribe `\lt` y `\gt` en vez de `<` y `>`. Si no, el navegador puede confundirlos con etiquetas.
- **Títulos en `datos.js`:** en las comillas de JavaScript la barra invertida va doble. Por ejemplo, `'Longitudes $\\xi$ y $\\lambda$'`.

Si una ecuación tiene un error, aparece en rojo con el mensaje y el resto de la página sigue funcionando.

**Macros de física ya definidas** (estilo paquete `physics`):
- **Dirac:** `\ket{\psi}`, `\bra{\phi}`, `\braket{\phi}{\psi}`, `\expval{A}`, `\mel{n}{H}{m}`.
- **Derivadas:** `\dv{f}{x}`, `\pdv{f}{x}`, `\dd`.
- **Conmutadores:** `\comm{A}{B}`, `\acomm{A}{B}`.
- **Otras:** `\abs{x}`, `\norm{v}`, `\vb{A}`, `\grad`, `\curl`, `\divg`, `\order{x^2}`, `\Tr`, `\tc` (= T_c).

Para agregar tus propias macros, edita el bloque `MACROS` en `js/latex.js`.

Si ya tienes un apunte en `.tex`, puedes copiar las ecuaciones casi sin cambios. KaTeX acepta la mayoría de los comandos de `amsmath`. No soporta paquetes externos, `\label`/`\ref` ni TikZ: numera con `\tag{n}` y cita el número a mano.

## Libros

Cada libro es un objeto de la lista `libros` en `js/datos.js`:

```js
{
  titulo: 'Introduction to Superconductivity',
  autor: 'Michael Tinkham',
  anio: '1975 · 2.ª ed. 1996',
  categoria: 'Física',            // los botones de filtro se crean a partir de este campo
  nivel: 'Posgrado',
  estado: 'leyendo',              // 'leido' | 'leyendo' | 'por-leer'
  progreso: 0.45,                 // solo para 'leyendo' (0 a 1)
  portada: '',                    // ruta a una foto tuya del libro, o vacío
  ecuacion: String.raw`2\Delta(0) \approx 3.53\,k_B \tc`,
  ecuacionNota: 'Qué dice la ecuación.',
  comentario: 'Tu reseña. Separa párrafos con una línea en blanco (\n\n).',
  curiosidades: ['Dato 1', 'Dato 2 con LaTeX: $\\kappa = \\lambda/\\xi$']
}
```

- **Portada:** si `portada` está vacío, el sitio dibuja una tapa propia con la ecuación del libro. Para usar una foto de tu ejemplar, guárdala en `img/libros/` y pon su ruta. No uses imágenes de portadas bajadas de internet, porque tienen derechos de autor.
- **`ecuacion`:** va dentro de `` String.raw`...` ``, así la barra invertida se escribe una sola vez.
- **`curiosidades` y `comentario`:** son texto normal entre comillas, así que el LaTeX lleva la barra doble (`\\xi`).
- **Ejemplos:** el estado, el avance y el comentario de los seis libros son de ejemplo. Los datos curiosos son reales.
- **Ecuaciones y títulos largos:** se achican solos para caber en la tapa.

## Fotos ("Bitácora de fotos")

Cada foto aparece impresa y pegada en el cuaderno, con su anotación a mano y una reseña. La foto destacada abre la sección en grande, y al hacer clic en cualquier foto se abre un visor con la reseña completa.

1. Copia la imagen a `img/fotos/`. Conviene exportarla en JPG o WebP de unos 2000 px de ancho y menos de 500 KB.
2. En `js/datos.js`, en la lista `fotos`:

```js
{
  src: 'img/fotos/horno.jpg',
  titulo: 'Horno de sinterizado',
  lugar: 'UNMSM',
  fecha: 'oct 2026',
  coleccion: 'Laboratorio',        // los botones de filtro salen de aquí
  destacada: true,                 // opcional: la foto que abre la sección
  resena: 'Primer párrafo.\n\nSegundo párrafo.',
  tecnica: 'f/2.8 · 1/250 s · ISO 400'   // opcional
}
```

- **`resena`:** en la tarjeta se ve el primer párrafo, y en el visor el texto completo. Acepta LaTeX en línea con `$...$` (con `\\` doble).
- **`destacada`:** si ninguna foto la tiene, se destaca la primera. Al filtrar por colección, se destaca la primera de esa colección.
- **Formato:** en las tarjetas, las fotos se recortan a 4:3; en el visor se ven completas.
- **Visor:** se maneja con las flechas o deslizando el dedo, y Esc lo cierra.
- **Ejemplos:** las reseñas que vienen son de ejemplo. Las que tienen corchetes `[...]` esperan tu texto.

## Libros de literatura

Los libros con `categoria: 'Literatura'` llevan una tapa tipográfica con un motivo dibujado en vez de una ecuación:

```js
{
  titulo: 'El extranjero', autor: 'Albert Camus', anio: '1942',
  categoria: 'Literatura', nivel: 'Novela',
  estado: 'leido', progreso: 1, portada: '',
  motivo: 'sol',          // 'sol' | 'mariposas' | 'hexagonos' | 'marca' | 'galones'
  resumen: 'De qué va, en una o dos frases.',
  comentario: '',
  curiosidades: ['…']
}
```

- **`resumen`:** aparece en la ficha como "De qué va".
- **`ecuacion`:** es opcional también aquí. *Ficciones* la usa para contar los libros de la Biblioteca de Babel.
- **Motivos nuevos:** se agregan en `MOTIVOS`, dentro de `js/main.js`. Cada uno es un pequeño SVG con `viewBox` de 0 a 100.

## Agregar una curiosidad

Agrega `{ dato, titulo, texto }` a la lista `curiosidades` en `js/datos.js`.

## Antes de publicar

- `index.html`: tu correo real, el título exacto del artículo y tus enlaces de ORCID, Google Scholar y GitHub.
- Los apuntes de ejemplo de `datos.js`: reemplázalos por los tuyos.

## Publicarlo gratis con GitHub Pages

1. Crea un repositorio público llamado `TU-USUARIO.github.io`.
2. Sube todo el contenido de `web-david/` a la raíz del repositorio.
3. En *Settings → Pages*, elige la rama `main` y la carpeta `/ (root)`.
4. En uno o dos minutos el sitio queda en `https://TU-USUARIO.github.io`.

Netlify y Cloudflare Pages también sirven: arrastras la carpeta y listo.
