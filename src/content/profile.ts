export const profileContent = {
  title: "Mi perfil",
  fallbackName: "Sin nombre",
  info: {
    heading: "Tus datos",
    emailLabel: "Correo electrónico",
    phoneLabel: "Teléfono",
    phoneEmpty: "Sin teléfono cargado",
    companyLabel: "Empresa",
    companyEmpty: "Sin empresa cargada",
    memberSinceLabel: "Miembro desde",
  },
  messages: {
    heading: "Mensajes",
    empty: "Todavía no tenés conversaciones. Iniciá una desde cualquier publicación del catálogo.",
    cta: { label: "Explorar el catálogo", href: "/catalogo" },
  },
  rentals: {
    heading: "Mis alquileres",
    empty: "Todavía no tenés alquileres activos.",
    viewAll: { label: "Ver mis alquileres", href: "/my-rentals" },
  },
  noProfileRow: "No encontramos tu perfil todavía. Volvé a intentarlo en unos segundos.",
} as const;
