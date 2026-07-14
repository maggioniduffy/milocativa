import type { RentalStatus } from "@/types/domain";

export const profileContent = {
  title: "Mi perfil",
  fallbackName: "Sin nombre",
  greeting: (name: string) => `¡Hola, ${name}!`,
  subtitle: "Gestioná tus solicitudes y alquileres activos en Vaca Muerta.",
  info: {
    heading: "Tus datos",
    contactHeading: "Información de contacto",
    verifiedLabel: "Usuario Verificado",
    editProfile: "Editar perfil",
    emailLabel: "Correo electrónico",
    phoneLabel: "Teléfono",
    phoneEmpty: "Sin teléfono cargado",
    companyLabel: "Empresa",
    companyEmpty: "Sin empresa cargada",
    memberSinceLabel: "Miembro desde",
  },
  stats: {
    activeRentals: "Alquileres Activos",
    pendingRequests: "Solicitudes Pendientes",
    newMessages: "Mensajes Nuevos",
  },
  tabs: {
    rentals: { label: "Mis Alquileres", empty: "Todavía no tenés alquileres activos." },
    history: { label: "Historial", empty: "Todavía no tenés alquileres finalizados." },
    payments: { label: "Pagos", empty: "Todavía no registramos pagos en tu cuenta." },
  },
  rentalCard: {
    detail: "Ver detalle",
    message: "Mensaje",
    rentAgain: "Volver a alquilar",
    dateSeparator: "–",
  },
  rentalStatusLabels: {
    requested: "SOLICITADO",
    accepted: "ACEPTADO",
    active: "ACTIVO",
    completed: "FINALIZADO",
    cancelled: "CANCELADO",
  } satisfies Record<RentalStatus, string>,
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
