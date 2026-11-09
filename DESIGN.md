# Design — Transmisiones Automáticas Los Angeles SJR

Mundo: señalética vial mexicana sobre fondo blanco. Las placas negras, la línea discontinua y el selector PRND del logotipo hacen el trabajo; el amarillo se reserva para lo que importa.

## Regla del amarillo
El amarillo señal solo marca tres cosas: **la acción principal, el indicador activo y la marca**. Nunca es fondo de sección ni color de titular. En escritorio ocupa cerca de 1 % de los fondos de la página (antes 25 %).

## Tokens
- `--white #FFFFFF` y `--paper #F5F4EF`: fondos, alternados por sección. `--ink #121212`: texto, cabecera, pie, placas oscuras. `--yellow #FFC20E`: acento según la regla anterior. Texto sobre amarillo: tinta.
- Tipografía: Barlow Condensed 700/800 en mayúsculas (letrero, titulares); Barlow 400–700 (texto). Titular del hero fluido hasta 9.5rem; resto de la escala `--step--1 … --step-3`.
- Radio de placa 16px; borde 3px tinta + aro interior de 2px (`.plate::after`). Botones: 12px radio, borde 3px, mayúsculas condensadas.
- Sin gradientes ni sombras duras. Foco: contorno 3px (tinta; amarillo sobre fondos oscuros).

## Logotipo
Vector en `assets/`, redibujado a partir del letrero del taller: dos asientos, volante, palanca y placa PRND, con el nombre en letras de trazo propio.
- `logo-horizontal-dark.svg` / `logo-vertical-dark.svg`: sobre fondos oscuros (marca amarilla, nombre blanco).
- `logo-horizontal-light.svg` / `logo-vertical-light.svg`: sobre fondos claros (todo en tinta, placa con letras amarillas).
- `icono.svg`: un solo asiento con volante, para tamaños pequeños. De él salen `favicon.ico` (16, 32 y 48 px), `apple-touch-icon.png` (180 px) e `icono-512.png`. Si cambia, hay que volver a exportarlos.

## Componentes
- `.btn--primary`: amarillo con borde tinta, para la acción principal en fondos claros. `.btn--yellow`: amarillo sobre placas oscuras. `.btn`: tinta. `.btn--ghost`: contorno.
- `.gate`: placa PRND del hero; `.gate-thumb` es el indicador amarillo.
- `.plate` (`--ink`, `--yellow` solo para avisos): lámina vial.
- `.road`: riel fijo a la izquierda con marcador amarillo que avanza con el scroll.
- `.svc-list`, `.locations`: listas separadas por reglas de 3px, no tarjetas.
- `.steps`: rombos numerados unidos por línea discontinua (el orden sí importa).
- `.reviews`: carrusel con scroll-snap y flechas accesibles. Avanza solo cada 5 s y se detiene con el botón de pausa, cursor, foco de teclado, toque, fuera de pantalla o pestaña oculta; con `prefers-reduced-motion` arranca en pausa.

## Movimiento
- Secuencia de firma del hero (≈1.25 s, una sola vez): el titular sube tras una máscara, la palanca pasa de P a D con paradas marcadas, cada parada enciende un servicio, y la foto se abre de abajo arriba como la cortina del taller. Los botones nunca esperan.
- El estado por defecto de todo el hero es el final; con `prefers-reduced-motion` no se reproduce la secuencia.
- Fuera del hero: revelado de secciones (420 ms) y marcador de la carretera ligado al scroll.
- Estado abierto/cerrado: el círculo parpadea (1.2 s) solo mientras está en pantalla, verde si está abierto y rojo si está cerrado. Pedido por Carlos. Con `prefers-reduced-motion` queda fijo.

## Datos y mantenimiento
Número, horario, servicios (ids estables) y enlaces: `site-config.js`. Textos de secciones: `index.html`.
