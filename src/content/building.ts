import type { UnitStatus } from "@/types/domain";

export interface BuildingUnit {
  id: string;
  name: string;
  status: UnitStatus;
  price: string;
  note: string;
}

export interface BuildingFloor {
  label: string;
  units: BuildingUnit[];
}

export interface BuildingDetail {
  slug: string;
  name: string;
  address: string;
  description: string;
  /** Top floor first, matching the cross-section reading order. */
  floors: BuildingFloor[];
  parking: BuildingUnit[];
}

export const buildingContent = {
  backLink: { label: "Volver al catálogo", href: "/catalogo" },
  badge: "Edificio",
  unitStatusLabels: {
    available: "Disponible",
    requested: "Solicitado",
    accepted: "Aceptado",
    active: "Activo",
    completed: "Completado",
    cancelled: "Cancelado",
    external: "No publicado",
  } satisfies Record<UnitStatus, string>,
  legendOrder: [
    "available",
    "requested",
    "accepted",
    "active",
    "completed",
    "external",
  ] satisfies UnitStatus[],
  summary: {
    title: "Resumen",
    totalUnits: "Unidades totales",
    availableNow: "Disponibles ahora",
    freeParking: "Cocheras libres",
    cta: { label: "Consultar disponibilidad", href: "/catalogo" },
  },
  // Placeholder detail until buildings come from Supabase (building-by-slug
  // with per-unit rental statuses).
  buildings: [
    {
      slug: "torre-anelo",
      name: "Torre Añelo",
      address: "Av. San Martín 450, Añelo · Neuquén",
      description:
        "Edificio residencial de ocho unidades a metros del centro de Añelo, pensado para personal de operadoras y empresas de servicios de Vaca Muerta. Amueblado, con seguridad y cochera propia.",
      floors: [
        {
          label: "4°",
          units: [
            {
              id: "u4a",
              name: "Depto 4A",
              status: "available",
              price: "$480.000/mes",
              note: "Disponible desde 01/08",
            },
            {
              id: "u4b",
              name: "Depto 4B",
              status: "requested",
              price: "$450.000/mes",
              note: "Con solicitud pendiente",
            },
          ],
        },
        {
          label: "3°",
          units: [
            {
              id: "u3a",
              name: "Depto 3A",
              status: "active",
              price: "$450.000/mes",
              note: "Alquilado hasta 12/2026",
            },
            {
              id: "u3b",
              name: "Depto 3B",
              status: "external",
              price: "Propietario particular",
              note: "Unidad de otro dueño · no publicada en MILOCATIVA",
            },
          ],
        },
        {
          label: "2°",
          units: [
            {
              id: "u2a",
              name: "Depto 2A",
              status: "accepted",
              price: "$440.000/mes",
              note: "Reserva aceptada · ingreso 20/07",
            },
            {
              id: "u2b",
              name: "Depto 2B",
              status: "completed",
              price: "$440.000/mes",
              note: "Contrato finalizado",
            },
          ],
        },
        {
          label: "1°",
          units: [
            {
              id: "u1a",
              name: "Depto 1A",
              status: "available",
              price: "$430.000/mes",
              note: "Disponible de inmediato",
            },
            {
              id: "u1b",
              name: "Depto 1B",
              status: "external",
              price: "Propietario particular",
              note: "Unidad de otro dueño · no publicada en MILOCATIVA",
            },
          ],
        },
      ],
      parking: [
        {
          id: "c1",
          name: "C1",
          status: "available",
          price: "$45.000/mes",
          note: "Cochera cubierta · Disponible",
        },
        {
          id: "c2",
          name: "C2",
          status: "active",
          price: "$45.000/mes",
          note: "Ocupada · alquilada hasta 12/2026",
        },
        {
          id: "c3",
          name: "C3",
          status: "available",
          price: "$45.000/mes",
          note: "Cochera cubierta · Disponible",
        },
        {
          id: "c4",
          name: "C4",
          status: "requested",
          price: "$45.000/mes",
          note: "Con solicitud pendiente",
        },
        {
          id: "c5",
          name: "C5",
          status: "available",
          price: "$48.000/mes",
          note: "Cochera doble · Disponible",
        },
      ],
    },
  ] satisfies BuildingDetail[],
} as const;

export function getBuildingBySlug(slug: string): BuildingDetail | undefined {
  return buildingContent.buildings.find((b) => b.slug === slug);
}
