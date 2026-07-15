export const siteContent = {
  brand: {
    name: "MILOCATIVA",
    tagline: "Alquileres para la industria del shale en Añelo, Neuquén.",
  },
  meta: {
    title: "MILOCATIVA — Alquileres en Añelo, Neuquén",
    description:
      "Inmuebles, maquinaria y servicios para la industria del shale. Conectamos a operadoras y empresas de servicios de Vaca Muerta con activos listos para alquilar en Añelo.",
  },
  nav: {
    links: [
      { label: "Inicio", href: "/" },
      { label: "Catálogo", href: "/catalogo" },
      { label: "Cómo funciona", href: "/#como-funciona" },
      { label: "Nosotros", href: "/#nosotros" },
    ],
    profile: { label: "Perfil", href: "/profile" },
    signIn: { label: "Ingresar", href: "/sign-in" },
    signOut: "Cerrar sesión",
    menuTitle: "Menú",
    openMenu: "Abrir menú",
    notifications: "Ver notificaciones",
    accountMenu: "Abrir menú de cuenta",
    themeToggle: "Cambiar tema",
  },
  footer: {
    columns: [
      {
        title: "Empresa",
        links: [
          { label: "Nosotros", href: "/#nosotros" },
          { label: "Cómo funciona", href: "/#como-funciona" },
          { label: "Contacto", href: "/contacto" },
        ],
      },
      {
        title: "Catálogo",
        links: [
          { label: "Inmuebles", href: "/catalogo?categoria=estate" },
          { label: "Maquinaria", href: "/catalogo?categoria=machinery" },
          { label: "Servicios", href: "/catalogo?categoria=service" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Términos", href: "/terminos" },
          { label: "Privacidad", href: "/privacidad" },
        ],
      },
    ],
    legal: "© 2026 MILOCATIVA. Todos los derechos reservados.",
    madeIn: "Hecho en Neuquén 🇦🇷",
  },
} as const;
