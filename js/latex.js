/* =========================================================================
   latex.js — convierte el LaTeX de la página en ecuaciones (con KaTeX)

   Cómo escribir en el HTML:
     En línea:          $E = mc^2$          o   \( E = mc^2 \)
     Bloque:            $$ \nabla\cdot\mathbf{B} = 0 $$   o   \[ ... \]
     Numerada:          $$ ... \tag{1} $$
     Entornos:          \begin{align} ... \end{align}  (también equation, gather, cases, pmatrix…)
     Un $ literal:      \$

   Ojo con "<" dentro del HTML: escribe \lt y \gt (o &lt; &gt;) para que el
   navegador no lo confunda con una etiqueta.

   Macros de física disponibles (estilo paquete "physics"):
     \ket{\psi}  \bra{\phi}  \braket{\phi}{\psi}  \expval{A}  \mel{n}{H}{m}
     \comm{A}{B}  \acomm{A}{B}  \abs{x}  \norm{v}  \dv{f}{x}  \pdv{f}{x}  \dd  \vb{A}  \grad  \curl  \divg
     \order{x^2}  \Tr  \Re  \Im  \sinc   \tc (= T_c)
   Agrega las tuyas en MACROS, abajo.
   ========================================================================= */
(function () {
  'use strict';

  var MACROS = {
    '\\ket': '\\left|#1\\right\\rangle',
    '\\bra': '\\left\\langle#1\\right|',
    '\\braket': '\\left\\langle#1\\middle|#2\\right\\rangle',
    '\\expval': '\\left\\langle#1\\right\\rangle',
    '\\mel': '\\left\\langle#1\\middle|#2\\middle|#3\\right\\rangle',
    '\\comm': '\\left[#1,#2\\right]',
    '\\acomm': '\\left\\{#1,#2\\right\\}',
    '\\abs': '\\left|#1\\right|',
    '\\norm': '\\left\\lVert#1\\right\\rVert',
    '\\dd': '\\mathrm{d}',
    '\\dv': '\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}',
    '\\pdv': '\\frac{\\partial#1}{\\partial#2}',
    '\\vb': '\\mathbf{#1}',
    '\\grad': '\\nabla',
    '\\curl': '\\nabla\\times',
    '\\divg': '\\nabla\\cdot',
    '\\order': '\\mathcal{O}\\left(#1\\right)',
    '\\Tr': '\\operatorname{Tr}',
    '\\Re': '\\operatorname{Re}',
    '\\Im': '\\operatorname{Im}',
    '\\sinc': '\\operatorname{sinc}',
    '\\tc': 'T_{\\mathrm{c}}'
  };

  var OPCIONES = {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\[', right: '\\]', display: true },
      { left: '\\begin{equation}', right: '\\end{equation}', display: true },
      { left: '\\begin{align}', right: '\\end{align}', display: true },
      { left: '\\begin{gather}', right: '\\end{gather}', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false }
    ],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'input'],
    ignoredClasses: ['sin-latex'],
    macros: MACROS,
    trust: false,
    strict: 'ignore',
    // Si una ecuación tiene un error, se muestra en rojo con el mensaje
    // en lugar de romper la página.
    throwOnError: false,
    errorColor: '#C2410C'
  };

  // Dibuja una sola fórmula (sin delimitadores) dentro de un elemento.
  window.renderTex = function (tex, elemento, enBloque) {
    if (!window.katex) { elemento.textContent = tex; return; }
    window.katex.render(tex, elemento, {
      displayMode: !!enBloque, macros: MACROS, throwOnError: false,
      errorColor: OPCIONES.errorColor, strict: 'ignore', trust: false
    });
  };

  // Disponible para main.js, que lo llama después de crear las listas.
  window.renderLatex = function (elemento) {
    if (typeof window.renderMathInElement !== 'function') {
      console.warn('KaTeX no cargó: revisa que exista la carpeta vendor/katex.');
      return;
    }
    window.renderMathInElement(elemento || document.body, OPCIONES);
  };
})();
