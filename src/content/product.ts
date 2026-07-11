import { catalogContent, type CatalogProduct } from "@/content/catalog";

export type QuickFactKey =
  | "area"
  | "rooms"
  | "furnished"
  | "parkingSpot"
  | "model"
  | "capacity"
  | "fuel"
  | "operator"
  | "duration"
  | "crew"
  | "modality"
  | "spotType"
  | "covered"
  | "dimensions";

export interface ProductQuickFact {
  key: QuickFactKey;
  label: string;
}

export interface ProductDetail {
  id: string;
  reviewCount: number;
  description: string;
  quickFacts: ProductQuickFact[];
  features: string[];
  /** Extra photos beyond the catalog card's cover image, same subject. */
  gallery: string[];
}

export const productContent = {
  meta: {
    titleTemplate: (title: string) => `${title} — MILOCATIVA`,
  },
  backLink: { label: "Volver al catálogo", href: "/catalogo" },
  favoriteLabel: "Favorito",
  shareLabel: "Compartir",
  reviewsSuffix: (count: number) => `${count} reseñas`,
  overview: {
    descriptionTitle: "Descripción",
    featuresTitle: "Lo que ofrece",
    locationTitle: "Ubicación",
    locationNote:
      "Zona aproximada. La dirección exacta se comparte al confirmar la conversación con el equipo de MILOCATIVA.",
  },
  booking: {
    contactCta: "Iniciar conversación",
    signInNote: "Necesitás iniciar sesión para contactar al equipo.",
    reportListing: "Reportar esta publicación",
  },
  notFoundTitle: "No encontramos esta publicación",
  quickFactLabels: {
    area: "Superficie",
    rooms: "Ambientes",
    furnished: "Amoblado",
    parkingSpot: "Cochera",
    model: "Modelo",
    capacity: "Capacidad",
    fuel: "Combustible",
    operator: "Operario",
    duration: "Duración",
    crew: "Cuadrilla",
    modality: "Modalidad",
    spotType: "Tipo",
    covered: "Techada",
    dimensions: "Dimensiones",
  } satisfies Record<QuickFactKey, string>,
  // Placeholder detail data until items and photos come from Supabase Storage.
  details: [
    {
      id: "e1",
      reviewCount: 24,
      description:
        "Departamento de dos ambientes totalmente amoblado, a pocas cuadras del centro de Añelo. Pensado para personal de operadoras y contratistas que necesitan una base cómoda durante su estadía en la zona: cocina equipada, wifi de alta velocidad y ropa de cama incluida.",
      quickFacts: [
        { key: "area", label: "58 m²" },
        { key: "rooms", label: "2 ambientes" },
        { key: "furnished", label: "Amoblado" },
        { key: "parkingSpot", label: "Cochera incluida" },
      ],
      features: [
        "Wifi de alta velocidad",
        "Cocina totalmente equipada",
        "Ropa de cama y toallas",
        "Aire acondicionado frío/calor",
        "Lavarropas",
        "Cochera cubierta incluida",
      ],
      gallery: ["/images/listing-modular-housing.png", "/images/hero-anelo.png"],
    },
    {
      id: "m1",
      reviewCount: 11,
      description:
        "Retroexcavadora CAT 320 disponible para alquiler diario en el Parque Industrial de Añelo. Ideal para movimiento de suelo, zanjeo y obras de infraestructura en yacimiento. Se entrega con mantenimiento al día y opción de operario certificado.",
      quickFacts: [
        { key: "model", label: "CAT 320" },
        { key: "capacity", label: "20 toneladas" },
        { key: "fuel", label: "Diésel" },
        { key: "operator", label: "Operario opcional" },
      ],
      features: [
        "Mantenimiento al día",
        "Traslado a obra coordinable",
        "Operario certificado opcional",
        "Seguro de responsabilidad civil incluido",
      ],
      gallery: ["/images/listing-excavator.png"],
    },
    {
      id: "s1",
      reviewCount: 32,
      description:
        "Servicio de catering para campamentos y bases operativas en zona rural de Añelo. Cuadrilla propia, menú adaptable a turnos rotativos y protocolos de higiene para la industria del shale. Cotización por cantidad de comensales y duración del contrato.",
      quickFacts: [
        { key: "duration", label: "Por contrato" },
        { key: "crew", label: "Cuadrilla incluida" },
        { key: "modality", label: "En sitio" },
      ],
      features: [
        "Menú adaptable a turnos rotativos",
        "Cuadrilla y logística incluidas",
        "Protocolos de higiene para yacimiento",
        "Cotización por comensales/día",
      ],
      gallery: ["/images/listing-service-crew.png"],
    },
    {
      id: "p1",
      reviewCount: 6,
      description:
        "Cochera cubierta individual en Barrio Norte, con acceso las 24 horas y vigilancia. Ideal como espacio fijo para vehículos de empresa o uso personal durante estadías prolongadas en Añelo.",
      quickFacts: [
        { key: "spotType", label: "Individual" },
        { key: "covered", label: "Techada" },
        { key: "dimensions", label: "2,5 x 5 m" },
      ],
      features: ["Acceso 24 horas", "Vigilancia", "Portón automático"],
      gallery: [],
    },
    {
      id: "e2",
      reviewCount: 18,
      description:
        "Casa de tres dormitorios con patio en Barrio Sur, Añelo. Buena opción para equipos de trabajo que comparten alojamiento durante estadías largas: espacios amplios, patio con parrilla y buena orientación.",
      quickFacts: [
        { key: "area", label: "110 m²" },
        { key: "rooms", label: "3 dormitorios" },
        { key: "furnished", label: "Sin amoblar" },
      ],
      features: ["Patio con parrilla", "Cocina comedor amplia", "Portón vehicular"],
      gallery: [],
    },
    {
      id: "m2",
      reviewCount: 9,
      description:
        "Camión hidrogrúa de 12 toneladas para izajes y traslado de equipos en el Parque Industrial y locaciones de Vaca Muerta. Disponible por día, con chofer habilitado incluido.",
      quickFacts: [
        { key: "model", label: "Hidrogrúa 12 tn" },
        { key: "capacity", label: "12 toneladas" },
        { key: "operator", label: "Chofer incluido" },
      ],
      features: [
        "Chofer habilitado incluido",
        "Disponible para traslados fuera de Añelo",
        "Seguro de carga incluido",
      ],
      gallery: ["/images/listing-crane.png"],
    },
    {
      id: "e3",
      reviewCount: 15,
      description:
        "Monoambiente equipado en pleno centro de Añelo, a pasos de comercios y oficinas. Ideal para estadías cortas de personal en tránsito por la zona.",
      quickFacts: [
        { key: "area", label: "32 m²" },
        { key: "rooms", label: "Monoambiente" },
        { key: "furnished", label: "Amoblado" },
        { key: "parkingSpot", label: "Cochera incluida" },
      ],
      features: ["Wifi de alta velocidad", "Cocina equipada", "Ropa de cama incluida"],
      gallery: [],
    },
    {
      id: "s2",
      reviewCount: 21,
      description:
        "Transporte de personal entre Añelo y locaciones de Vaca Muerta, con unidades habilitadas y choferes con experiencia en caminos de yacimiento. Contratable por día o por contrato mensual.",
      quickFacts: [
        { key: "duration", label: "Por día o contrato" },
        { key: "crew", label: "Chofer incluido" },
        { key: "modality", label: "Puerta a locación" },
      ],
      features: [
        "Unidades habilitadas para yacimiento",
        "Choferes con experiencia en Vaca Muerta",
        "Seguimiento de recorrido",
      ],
      gallery: [],
    },
  ] satisfies ProductDetail[],
} as const;

export interface ProductWithDetail extends CatalogProduct {
  detail: ProductDetail;
}

export function getProductById(id: string): ProductWithDetail | undefined {
  const product = catalogContent.products.find((p) => p.id === id);
  const detail = productContent.details.find((d) => d.id === id);
  if (!product || !detail) return undefined;
  return { ...product, detail };
}
