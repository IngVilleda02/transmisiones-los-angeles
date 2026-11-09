/* Datos comerciales editables. Todo lo marcado PENDIENTE requiere confirmación del cliente. */
window.SITE = {
  nombre: "Transmisiones Automáticas Los Angeles SJR",
  whatsapp: "524274272933", // +52 427 427 2933 (formato internacional, sin signos)
  whatsappVisible: "427 427 2933",
  instagram: "https://www.instagram.com/transmisioneslosangeles?vrfl=MWJ3cXJrdGU3bXNk",
  mapsEnlace: "https://maps.app.goo.gl/kJwEHZ7QSfghh79c7",
  zonaHoraria: "America/Mexico_City",
  // 0 = domingo ... 6 = sábado. Cada día: lista de [apertura, cierre] en minutos desde 00:00. [] = cerrado.
  horario: {
    0: [],
    1: [[540, 1080]], 2: [[540, 1080]], 3: [[540, 1080]], 4: [[540, 1080]], 5: [[540, 1080]],
    6: [[540, 780]]
  },
  // Identificadores estables: se usan en el formulario (preselección) y en los botones de cada servicio.
  servicios: [
    { id: "transmision", nombre: "Reparación de transmisión automática" },
    { id: "preventivo", nombre: "Mantenimiento preventivo de transmisión" },
    { id: "venta", nombre: "Venta de transmisiones nuevas y usadas" },
    { id: "doble-embrague", nombre: "Cambio de doble embrague" },
    { id: "curso", nombre: "Curso de doble embrague" },
    { id: "diagnostico", nombre: "Diagnóstico de automóvil" },
    { id: "ac", nombre: "Aire acondicionado y filtros A/A" },
    { id: "frenos", nombre: "Frenos" },
    { id: "direccion", nombre: "Dirección y suspensión" },
    { id: "otro", nombre: "Otro / no sé qué necesita mi auto" }
  ]
};
