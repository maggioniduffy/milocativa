import type { Category } from "@/types/domain";

export type CatalogFilterType = Category | "all";

export interface CatalogTypeFilter {
  id: CatalogFilterType;
  label: string;
}

export interface CatalogBuilding {
  slug: string;
  name: string;
  address: string;
  available: number;
  total: number;
  coverAlt: string;
}

export interface CatalogProduct {
  id: string;
  category: Category;
  title: string;
  location: string;
  price: string;
  unit: string;
  rating: string;
  /** Estate bundled with a rentable cochera. */
  hasParking: boolean;
  /** Real photo when one exists; otherwise `cover` gradient is used. */
  image?: string;
  imageAlt?: string;
  cover?: string;
}

const gradient = (hue: number, dark: boolean) =>
  `linear-gradient(135deg, hsl(${hue} ${dark ? 28 : 34}% ${dark ? 38 : 74}%), hsl(${
    hue + 18
  } 30% ${dark ? 32 : 46}%))`;

export const catalogContent = {
  meta: {
    title: "Catálogo — MILOCATIVA",
    description:
      "Explorá inmuebles, maquinaria, servicios y cocheras en alquiler en Añelo, Neuquén — el catálogo de MILOCATIVA para la industria de Vaca Muerta.",
  },
  search: {
    placeholder: "Buscar inmuebles, maquinaria o servicios en Añelo…",
    submitLabel: "Buscar",
    priceLabel: "Precio",
    durationLabel: "Duración",
    availabilityLabel: "Disponibilidad",
    resultsSuffix: "resultados",
  },
  typeFilters: [
    { id: "all", label: "Todos" },
    { id: "estate", label: "Inmuebles" },
    { id: "machinery", label: "Maquinaria" },
    { id: "service", label: "Servicios" },
    { id: "parking", label: "Cocheras" },
  ] satisfies CatalogTypeFilter[],
  categoryTags: {
    estate: "Inmueble",
    machinery: "Maquinaria",
    service: "Servicio",
    parking: "Cochera",
  } satisfies Record<Category, string>,
  buildingsSection: {
    title: "Edificios",
    subtitle: "Propiedades con varias unidades bajo una misma administración",
    viewAll: { label: "Ver todos", href: "/catalogo" },
    showAll: { label: "Mostrar todo", href: "/catalogo" },
    prevLabel: "Anterior",
    nextLabel: "Siguiente",
    favoriteLabel: "Favorito",
    availableTemplate: (available: number, total: number) =>
      `${available} disponibles de ${total}`,
  },
  productsSection: {
    title: "Productos",
    subtitle: "Inmuebles, maquinaria, servicios y cocheras individuales",
    parkingIncluded: "Con cochera disponible",
    favoriteLabel: "Favorito",
  },
  // Placeholder data until the catalog is wired to Supabase.
  buildings: [
    {
      slug: "torre-anelo",
      name: "Torre Añelo",
      address: "Av. San Martín 450, Añelo",
      available: 3,
      total: 8,
      coverAlt: "Fachada de Torre Añelo",
    },
    {
      slug: "residencial-shale",
      name: "Residencial Shale",
      address: "Los Álamos 120, Añelo",
      available: 5,
      total: 12,
      coverAlt: "Fachada de Residencial Shale",
    },
    {
      slug: "complejo-neuquen",
      name: "Complejo Neuquén",
      address: "Ruta 7 Km 12, Añelo",
      available: 2,
      total: 6,
      coverAlt: "Fachada de Complejo Neuquén",
    },
    {
      slug: "edificio-vaca-muerta",
      name: "Edificio Vaca Muerta",
      address: "Calle 9 y 20, Añelo",
      available: 7,
      total: 10,
      coverAlt: "Fachada de Edificio Vaca Muerta",
    },
    {
      slug: "mirador-del-valle",
      name: "Mirador del Valle",
      address: "Los Nogales 88, Añelo",
      available: 1,
      total: 9,
      coverAlt: "Fachada de Mirador del Valle",
    },
  ] satisfies CatalogBuilding[],
  products: [
    {
      id: "e1",
      category: "estate",
      title: "Departamento 2 amb. amoblado",
      location: "Centro, Añelo",
      price: "$420.000",
      unit: "/mes",
      rating: "4,9",
      hasParking: true,
      image: "/images/listing-modular-housing.png",
      imageAlt: "Departamento amoblado en módulos habitacionales",
    },
    {
      id: "m1",
      category: "machinery",
      title: "Retroexcavadora CAT 320",
      location: "Parque Industrial",
      price: "$180.000",
      unit: "/día",
      rating: "4,8",
      hasParking: false,
      image: "/images/listing-excavator.png",
      imageAlt: "Retroexcavadora CAT 320 en obra",
    },
    {
      id: "s1",
      category: "service",
      title: "Catering para campamento",
      location: "Zona rural, Añelo",
      price: "$95.000",
      unit: "/servicio",
      rating: "5,0",
      hasParking: false,
      image: "/images/listing-service-crew.png",
      imageAlt: "Cuadrilla de servicio de catering en campamento",
    },
    {
      id: "p1",
      category: "parking",
      title: "Cochera cubierta individual",
      location: "Barrio Norte",
      price: "$45.000",
      unit: "/mes",
      rating: "4,7",
      hasParking: false,
      cover: gradient(200, false),
    },
    {
      id: "e2",
      category: "estate",
      title: "Casa 3 dormitorios con patio",
      location: "Barrio Sur, Añelo",
      price: "$680.000",
      unit: "/mes",
      rating: "4,9",
      hasParking: false,
      cover: gradient(190, false),
    },
    {
      id: "m2",
      category: "machinery",
      title: "Camión hidrogrúa 12 tn",
      location: "Parque Industrial",
      price: "$240.000",
      unit: "/día",
      rating: "4,6",
      hasParking: false,
      image: "/images/listing-crane.png",
      imageAlt: "Camión hidrogrúa de 12 toneladas",
    },
    {
      id: "e3",
      category: "estate",
      title: "Monoambiente equipado",
      location: "Centro, Añelo",
      price: "$310.000",
      unit: "/mes",
      rating: "4,8",
      hasParking: true,
      cover: gradient(210, false),
    },
    {
      id: "s2",
      category: "service",
      title: "Transporte de personal",
      location: "Añelo · Vaca Muerta",
      price: "$130.000",
      unit: "/día",
      rating: "4,9",
      hasParking: false,
      cover: gradient(160, false),
    },
  ] satisfies CatalogProduct[],
} as const;

export function filterProducts(type: CatalogFilterType): readonly CatalogProduct[] {
  return type === "all"
    ? catalogContent.products
    : catalogContent.products.filter((p) => p.category === type);
}
