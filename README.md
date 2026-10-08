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

## Ejecutar en local

El i18n usa `fetch()`, así que necesita servirse por HTTP (no abrir el `.html` directo desde el disco):

```bash
python -m http.server 8080
```

Luego abre `http://localhost:8080/index.html`.
