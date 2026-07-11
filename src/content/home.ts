import type { Category } from "@/types/domain";

export interface HomeListing {
  id: string;
  category: Category;
  name: string;
  location: string;
  price: string;
  period: string;
  rating: string;
  availability: string;
  /** Tone of the availability note: green when ready now, amber when future-dated. */
  availabilityTone: "success" | "warning";
  image: string;
  imageAlt: string;
}

export interface HomeCategoryCard {
  id: Category;
  name: string;
  description: string;
  href: string;
}

export const homeContent = {
  hero: {
    eyebrow: "Alquileres en Añelo · Vaca Muerta",
    title: "Inmuebles, maquinaria y servicios para la industria del shale",
    subtitle:
      "Conectamos a operadoras y empresas de servicios de Vaca Muerta con propiedades, equipos y servicios listos para alquilar en Añelo y la región del Neuquén.",
    primaryCta: { label: "Explorar catálogo", href: "/catalogo" },
    secondaryCta: { label: "Cómo funciona", href: "/#como-funciona" },
    stats: ["+120 activos disponibles", "3 categorías", "Gestión 100% local"],
    image: {
      src: "/images/hero-anelo.png",
      alt: "Equipo de perforación en la meseta de Vaca Muerta al atardecer, cerca de Añelo",
    },
  },
  about: {
    anchorId: "nosotros",
    // Split so the accent renders in the display serif italic.
    titleLead: "Una empresa local",
    titleAccent: "para un negocio exigente",
    body: "MILOCATIVA es una empresa de Añelo especializada en el alquiler de activos para el petróleo y gas no convencional. Desde alojamientos y galpones hasta maquinaria pesada y servicios operativos, gestionamos cada contrato de forma simple, transparente y confiable.",
  },
  catalogPreview: {
    title: "Explorá el catálogo",
    viewAll: { label: "Ver todo", href: "/catalogo" },
    goToCatalog: { label: "Ir al catálogo", href: "/catalogo" },
    favoriteLabel: "Favorito",
    categoryLabels: {
      estate: "Inmuebles",
      machinery: "Maquinaria",
      service: "Servicios",
      parking: "Cocheras",
    } satisfies Record<Category, string>,
    categories: [
      {
        id: "estate",
        name: "Inmuebles",
        description:
          "Alojamientos para personal, oficinas y galpones listos para operar en Añelo.",
        href: "/catalogo?categoria=estate",
      },
      {
        id: "machinery",
        name: "Maquinaria",
        description: "Equipos pesados y vehículos para el yacimiento, con o sin operador.",
        href: "/catalogo?categoria=machinery",
      },
      {
        id: "service",
        name: "Servicios",
        description:
          "Catering, logística e izaje: servicios operativos gestionados localmente.",
        href: "/catalogo?categoria=service",
      },
    ] satisfies HomeCategoryCard[],
    // Placeholder listings until the public catalog is wired to Supabase.
    listings: [
      {
        id: "casa-personal",
        category: "estate",
        name: "Casa para personal · 3 dormitorios",
        location: "Añelo, Neuquén",
        price: "$450.000",
        period: "/ mes",
        rating: "4,98",
        availability: "Disponible ahora",
        availabilityTone: "success",
        image: "/images/listing-modular-housing.png",
        imageAlt: "Módulos habitacionales prefabricados en hilera",
      },
      {
        id: "galpon-logistico",
        category: "estate",
        name: "Galpón logístico 600 m²",
        location: "Añelo, Neuquén",
        price: "$1.200.000",
        period: "/ mes",
        rating: "4,81",
        availability: "Disponible ahora",
        availabilityTone: "success",
        image: "/images/listing-warehouse.png",
        imageAlt: "Galpón industrial con portones abiertos y playa de maniobras",
      },
      {
        id: "retroexcavadora-cat",
        category: "machinery",
        name: "Retroexcavadora CAT 420F",
        location: "Añelo, Neuquén",
        price: "$2.800.000",
        period: "/ mes",
        rating: "4,89",
        availability: "Desde 01/08/2026",
        availabilityTone: "warning",
        image: "/images/listing-excavator.png",
        imageAlt: "Excavadora hidráulica trabajando sobre terreno árido",
      },
      {
        id: "camioneta-4x4",
        category: "machinery",
        name: "Camioneta 4x4 doble cabina",
        location: "Añelo, Neuquén",
        price: "$950.000",
        period: "/ mes",
        rating: "5,0",
        availability: "Disponible ahora",
        availabilityTone: "success",
        image: "/images/listing-water-truck.png",
        imageAlt: "Camión cisterna en un camino de ripio",
      },
      {
        id: "catering-campamento",
        category: "service",
        name: "Catering para campamento · 40 pax",
        location: "Añelo, Neuquén",
        price: "$3.500.000",
        period: "/ mes",
        rating: "4,79",
        availability: "Cupos disponibles",
        availabilityTone: "success",
        image: "/images/listing-service-crew.png",
        imageAlt: "Cuadrilla de operarios con equipo de seguridad en el yacimiento",
      },
      {
        id: "izaje-grua",
        category: "service",
        name: "Izaje con grúa 30 t · con operador",
        location: "Añelo, Neuquén",
        price: "$180.000",
        period: "/ día",
        rating: "4,9",
        availability: "Disponible ahora",
        availabilityTone: "success",
        image: "/images/listing-crane.png",
        imageAlt: "Grúa telescópica montada sobre camión en locación petrolera",
      },
    ] satisfies HomeListing[],
  },
  howItWorks: {
    anchorId: "como-funciona",
    title: "Cómo funciona",
    subtitle: "Del catálogo al contrato en cuatro pasos.",
    steps: [
      {
        title: "Explorá el catálogo",
        description: "Filtrá por tipo, precio, plazo de contrato y disponibilidad.",
      },
      {
        title: "Enviá tu solicitud",
        description:
          "Contactá desde cada publicación. Toda la comunicación queda organizada por ítem.",
      },
      {
        title: "Confirmá y coordiná",
        description:
          "El equipo revisa y acepta tu solicitud, y coordinan el inicio del alquiler.",
      },
      {
        title: "Pagá como prefieras",
        description:
          "Dentro de la app con Stripe o MercadoPago, o por fuera si lo acordás.",
      },
    ],
  },
} as const;
