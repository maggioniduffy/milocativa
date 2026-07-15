export type Category = "estate" | "machinery" | "service" | "parking";

/** Clerk `publicMetadata.role` — no separate roles table. */
export type Role = "admin" | "user";

export type RentalStatus =
  | "requested"
  | "accepted"
  | "active"
  | "completed"
  | "cancelled";

/**
 * Display status of a building unit: a rental status, free to rent, or owned
 * by a third party and not published on the platform.
 */
export type UnitStatus = RentalStatus | "available" | "external";

export interface BadgeColor {
  /** Dim background fill — always paired with the matching saturated text color. */
  fill: string;
  text: string;
}

export interface UnitStatusColor extends BadgeColor {
  border: string;
}

export const CATEGORY_COLORS: Record<Category, BadgeColor> = {
  estate: { fill: "rgba(3, 89, 127, 0.10)", text: "#03597F" },
  machinery: { fill: "rgba(217, 142, 30, 0.12)", text: "#B8720F" },
  service: { fill: "rgba(14, 140, 127, 0.10)", text: "#0E8C7F" },
  // ParkingSpot shares the brand petrol but renders as an outline badge variant.
  parking: { fill: "transparent", text: "#03597F" },
};

/** Dot / active-pill color for the catalog type filter, including the "all" option. */
export const CATALOG_FILTER_COLORS: Record<Category | "all", string> = {
  all: "#03597F",
  estate: "#03597F",
  machinery: "#B8720F",
  service: "#0E8C7F",
  parking: "#3E8FB0",
};

export const RENTAL_STATUS_COLORS: Record<RentalStatus, BadgeColor> = {
  requested: { fill: "rgba(63, 143, 176, 0.12)", text: "#3E8FB0" },
  accepted: { fill: "rgba(14, 140, 127, 0.12)", text: "#0E8C7F" },
  active: { fill: "rgba(31, 157, 107, 0.12)", text: "#1F9D6B" },
  completed: { fill: "rgba(111, 135, 144, 0.12)", text: "#6F8790" },
  cancelled: { fill: "rgba(217, 72, 63, 0.10)", text: "#D9483F" },
};

/** Diagonal hatch used for units of other owners not published on the platform. */
export const EXTERNAL_UNIT_HATCH =
  "repeating-linear-gradient(45deg, #F2F5F6, #F2F5F6 6px, #E9EEEF 6px, #E9EEEF 12px)";

/** Striped floor texture behind the parking bays in the building cross-section. */
export const PARKING_LEVEL_HATCH =
  "repeating-linear-gradient(45deg, #EEF2F3, #EEF2F3 8px, #E4EAEC 8px, #E4EAEC 16px)";

export const UNIT_STATUS_COLORS: Record<UnitStatus, UnitStatusColor> = {
  available: { fill: "#FFFFFF", text: "#3E545C", border: "#C9D3D6" },
  requested: {
    fill: "rgba(63, 143, 176, 0.12)",
    text: "#3E8FB0",
    border: "rgba(63, 143, 176, 0.30)",
  },
  accepted: {
    fill: "rgba(14, 140, 127, 0.12)",
    text: "#0E8C7F",
    border: "rgba(14, 140, 127, 0.30)",
  },
  active: {
    fill: "rgba(31, 157, 107, 0.12)",
    text: "#1F9D6B",
    border: "rgba(31, 157, 107, 0.30)",
  },
  completed: {
    fill: "rgba(111, 135, 144, 0.12)",
    text: "#6F8790",
    border: "rgba(111, 135, 144, 0.30)",
  },
  cancelled: {
    fill: "rgba(217, 72, 63, 0.10)",
    text: "#D9483F",
    border: "rgba(217, 72, 63, 0.28)",
  },
  external: { fill: EXTERNAL_UNIT_HATCH, text: "#9FB2B8", border: "#DCE3E5" },
};
