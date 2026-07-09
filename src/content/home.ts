import type { Category } from "@/types/domain";

export interface HomeListing {
  id: string;
  category: Category;
  name: string;
  location: string;
  price: string;
  period: string;
  availability: string;
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
    title: "Una empresa local para un negocio exigente",
    body: "MILOCATIVA es una empresa de Añelo especializada en el alquiler de activos para el petróleo y gas no convencional. Desde alojamientos y galpones hasta maquinaria pesada y servicios operativos, gestionamos cada contrato de forma simple, transparente y confiable.",
  },
  catalogPreview: {
    title: "Explorá el catálogo",
    viewAll: { label: "Ver todo", href: "/catalogo" },
    goToCatalog: { label: "Ir al catálogo", href: "/catalogo" },
    categoryLabels: {
      estate: "Inmuebles",
      machinery: "Maquinaria",
      service: "Servicios",
    } satisfies Record<Category, string>,
    categories: [
      {
        id: "estate",
        name: "Inmuebles",
        description: "Alojamientos, oficinas y galpones listos para operar.",
        href: "/catalogo?categoria=estate",
      },
      {
        id: "machinery",
        name: "Maquinaria",
        description: "Equipos pesados y vehículos para el trabajo en el yacimiento.",
        href: "/catalogo?categoria=machinery",
      },
      {
        id: "service",
        name: "Servicios",
        description: "Cuadrillas y servicios operativos para tu proyecto.",
        href: "/catalogo?categoria=service",
      },
    ] satisfies HomeCategoryCard[],
    // Placeholder listings until the public catalog is wired to Supabase.
    listings: [
      {
        id: "galpon-logistico",
        category: "estate",
        name: "Galpón logístico 600 m²",
        location: "Añelo, Neuquén",
        price: "$2.400.000",
        period: "/ mes",
        availability: "Disponible ahora",
        image: "/images/listing-warehouse.png",
        imageAlt: "Galpón industrial con portones abiertos y playa de maniobras",
      },
      {
        id: "excavadora-hidraulica",
        category: "machinery",
        name: "Excavadora hidráulica 20 t",
        location: "Añelo, Neuquén",
        price: "$380.000",
        period: "/ día",
        availability: "Disponible ahora",
        image: "/images/listing-excavator.png",
        imageAlt: "Excavadora hidráulica trabajando sobre terreno árido",
      },
      {
        id: "alojamiento-modular",
        category: "estate",
        name: "Alojamiento modular 12 plazas",
        location: "Añelo, Neuquén",
        price: "$1.850.000",
        period: "/ mes",
        availability: "Disponible desde 01/08/2026",
        image: "/images/listing-modular-housing.png",
        imageAlt: "Módulos habitacionales prefabricados en hilera",
      },
      {
        id: "cuadrilla-operativa",
        category: "service",
        name: "Cuadrilla de servicios operativos",
        location: "Añelo y región",
        price: "$520.000",
        period: "/ semana",
        availability: "Disponible ahora",
        image: "/images/listing-service-crew.png",
        imageAlt: "Cuadrilla de operarios con equipo de seguridad en el yacimiento",
      },
      {
        id: "camion-regador",
        category: "machinery",
        name: "Camión regador de agua",
        location: "Añelo, Neuquén",
        price: "$290.000",
        period: "/ día",
        availability: "Disponible desde 15/07/2026",
        image: "/images/listing-water-truck.png",
        imageAlt: "Camión cisterna regando un camino de ripio",
      },
      {
        id: "grua-telescopica",
        category: "machinery",
        name: "Grúa telescópica 50 t",
        location: "Añelo, Neuquén",
        price: "$650.000",
        period: "/ día",
        availability: "Disponible ahora",
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
