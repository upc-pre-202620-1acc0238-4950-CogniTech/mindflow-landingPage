# mindflow-landingPage

Landing page de MindFlow (CogniTech) para la app móvil Android. Sitio estático (HTML/CSS/JS, sin build step), con i18n ES/EN.

Enlace de la landing page desplegada en GitHub Pages: https://upc-pre-202620-1acc0238-4950-cognitech.github.io/mindflow-landingPage/

## Estructura

- `index.html` — página principal (producto).
- `nosotros.html` — sobre nosotros (misión, visión, equipo).
- `assets/legal/` — términos, privacidad y cookies.
- `assets/styles.css`, `assets/script.js` — estilos e interacción compartidos (i18n, nav, animaciones).
- `assets/i18n/es.json` / `en.json` — textos por idioma.
- `assets/images/` — logo, fotos del equipo y capturas de la app.

## Secciones

**`index.html`**

| Sección | Ancla | Contenido |
|---|---|---|
| Hero | `#hero` | Propuesta de valor y botón principal de descarga |
| El problema | `#problem` | Por qué cuesta gestionar las emociones sin datos |
| Cómo funciona | `#how-it-works` | Los tres pasos de uso de la app |
| Capturas | `#screenshots` | Vistas de la app en el teléfono |
| Por qué MindFlow | `#why-mindflow` | Diferencias frente a un diario genérico |
| Funciones | `#features` | Funcionalidades principales y su beneficio |
| Analíticas | `#analytics` | Vista previa de tendencias emocionales |
| Planes | `#pricing` | Freemium y Premium |
| CTA final | `#cta` | Llamado a descargar la app |

**`nosotros.html`**: presentación de CogniTech (`#about-hero`), misión y visión (`#mission`), equipo (`#team`) y CTA final (`#cta`).

## Idiomas (i18n)

- Los textos no están escritos en el HTML: cada elemento tiene un atributo `data-i18n="clave"` y `assets/script.js` lo reemplaza con el texto de `assets/i18n/es.json` o `en.json`.
- El botón de idioma alterna entre español e inglés y guarda la elección en `localStorage` (clave `mindflow-locale`), así que se mantiene al recargar o cambiar de página.
- Para agregar o cambiar un texto, edita la **misma clave en los dos archivos** (`es.json` y `en.json`); si falta en uno, ese idioma se verá incompleto.

## Ejecutar en local

El i18n usa `fetch()`, así que necesita servirse por HTTP (no abrir el `.html` directo desde el disco):

```bash
python -m http.server 8080
```

Luego abre `http://localhost:8080/index.html`.
