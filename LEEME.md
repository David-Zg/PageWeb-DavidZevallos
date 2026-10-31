# Web personal de David Zevallos

El sitio está hecho con HTML, CSS y JavaScript puros. No usa frameworks, librerías ni un paso de compilación. Las ecuaciones están en **MathML**, que Chrome, Edge, Firefox y Safari dibujan de forma nativa.

## Estructura

```
web-david/
├── index.html                  Inicio: portada, apuntes, curiosidades, fotos, sobre mí
├── apuntes/
│   └── ginzburg-landau.html    Ejemplo de página de apunte (cópiala para cada apunte nuevo)
├── css/styles.css              Todo el diseño, con tema claro y oscuro
├── js/datos.js                 ← LO ÚNICO QUE EDITAS para agregar apuntes, curiosidades y fotos
├── js/main.js                  Filtros, búsqueda, visor de fotos, tema, menú móvil
├── img/fotos/                  Aquí van tus fotos
└── pdf/                        Aquí van los PDF escaneados de tus apuntes
```

## Verlo en tu computadora

Abre `index.html` con doble clic. Funciona sin servidor, porque los datos se cargan como script y no con `fetch`.

## Agregar un apunte

1. Copia `apuntes/ginzburg-landau.html` con otro nombre, por ejemplo `apuntes/oscilador-armonico.html`.
2. Cambia el título, la fecha, el texto y las ecuaciones. En el `<nav id="vecinos">` del final, cambia `data-url` por la ruta nueva.
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

## Escribir ecuaciones sin teclear MathML a mano

Escribir MathML a mano es pesado. Lo práctico es redactar el apunte en Markdown con LaTeX y convertirlo con **Pandoc**, que genera MathML nativo:

```bash
pandoc apunte.md --mathml -o cuerpo.html
```

Después pegas el contenido de `cuerpo.html` dentro del `<article class="nota">` de la plantilla. Para que cada ecuación numerada se vea en su recuadro, envuélvela así:

```html
<figure class="ecuacion">
  <div class="ecuacion-scroll"> …aquí el <math display="block">… </div>
  <span class="ecuacion__num">(1)</span>
</figure>
```

## Agregar fotos

1. Copia la imagen a `img/fotos/`. Conviene exportarla en JPG o WebP de unos 1600 px de ancho y menos de 400 KB.
2. En `js/datos.js`, rellena `src`:

```js
{ src: 'img/fotos/horno.jpg', pie: 'Horno de sinterizado', lugar: 'UNMSM', forma: 'grande' }
```

`forma` acepta estos valores:
- `normal`: 1×1.
- `ancha`: 2×1.
- `alta`: 1×2.
- `grande`: 2×2.

Al tocar una foto se abre un visor. Se navega con las flechas del teclado o deslizando el dedo en el celular.

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
