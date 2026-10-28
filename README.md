# Ai Labs · Walter Morales

Sitio estático sin dependencias.

- `index.html`: inicio y QR.
- `github/index.html`: ruta `/github` (los servidores estáticos suelen redirigir a `/github/`).
- `script.js`: carga `people.md` con fetch y lo renderiza con JavaScript.
- `people.md`: contenido editable de la página GitHub.

## Ejecutar

Desde la raíz del repo:

```sh
python3 -m http.server 8765
```

Abrir http://localhost:8765. Para que fetch pueda leer el Markdown, usar HTTP en lugar de abrir el HTML con file://. Publicar la carpeta raíz en un servidor estático.

Markdown soportado: títulos, párrafos por línea, listas con guiones, enlaces HTTP/HTTPS/mailto, negritas, código inline y bloques de código. HTML arbitrario se trata como texto. No usa un parser completo de Markdown.
