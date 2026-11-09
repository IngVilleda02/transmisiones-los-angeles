# Landing — Transmisiones Automáticas Los Angeles SJR

Sitio estático (HTML/CSS/JS). Abrir con cualquier servidor estático, por ejemplo `python -m http.server 5173` en esta carpeta.

## Editar
- Número de WhatsApp, horario, lista de servicios, Instagram, enlace de Maps: `site-config.js`.
- Textos y reseñas: `index.html`. Estilos y tokens: `styles.css` (variables en `:root`).
- Fotos: `assets/` (JPG optimizados a partir de `IMG/`).
- Logotipo: `assets/logo-*.svg` e `icono.svg`. Si el taller tiene el archivo vectorial original, reemplazar estos con el mismo nombre.

## Pendiente del cliente
1. Fotos de trabajos concretos, si se quieren mostrar casos (necesidad, servicio y resultado).
2. Autorización de los clientes para mostrar sus nombres en las reseñas (capturas de Google).
3. Dominio definitivo: quitar `noindex`, agregar canonical, sitemap, robots y Open Graph con URL absoluta.
4. Aviso de privacidad: responsable, domicilio y derechos ARCO (`privacidad.html` es un borrador).
5. URL de inserción (embed) de Google Maps si se quiere mapa incrustado; hoy solo hay enlaces «Abrir en Google Maps» y «Cómo llegar».
6. Temario, fechas y costos del curso de doble embrague; enlace de crédito de Mirai Nexus (hoy texto simple).
7. Confirmar cuál dirección corresponde al enlace de Maps proporcionado.
8. Visto bueno del logotipo redibujado, o el archivo vectorial original del taller.

## Comprobado
- Sin desbordamiento horizontal a 320, 390 y 1000 px. Reseñas y secciones revisadas visualmente a 390 y 1440 px.
- Formulario: valida, preselecciona servicio y arma el enlace de WhatsApp. El aviso de éxito se probó con `window.open` simulado; el de ventana bloqueada, con el bloqueo real del navegador de prueba. No se envió ningún mensaje. No usa almacenamiento local.
- Teclado y foco a 390 px: ningún control queda tapado por la barra fija, la barra oculta no recibe foco, las flechas del carrusel conservan el foco.
- Sin JavaScript (iframe sin scripts): aparece el aviso con enlace a WhatsApp, el menú queda visible y el contenido no se oculta.
- A 320×256 las barras dejan de ser fijas.
- Carrusel de reseñas en navegador sin interfaz a 1440 y 390 px: avanza una tarjeta cada 5 s, vuelve al inicio al llegar al final, y no avanza con pausa, cursor, foco de teclado, toque ni fuera de pantalla.

## No comprobado
- WhatsApp abierto en un celular real, lector de pantalla, `prefers-reduced-motion` en ejecución.
- Lighthouse/LCP/INP/CLS, capturas a 360/768, cabeceras HTTP/CSP (dependen del hosting).
