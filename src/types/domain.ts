export type Category = "estate" | "machinery" | "service";

export type RentalStatus =
  | "requested"
  | "accepted"
  | "active"
  | "completed"
  | "cancelled";

export interface BadgeColor {
  /** Dim background fill — always paired with the matching saturated text color. */
  fill: string;
  text: string;
}

export const CATEGORY_COLORS: Record<Category, BadgeColor> = {
  estate: { fill: "rgba(12, 86, 120, 0.10)", text: "#0C5678" },
  machinery: { fill: "rgba(217, 142, 30, 0.12)", text: "#B8720F" },
  service: { fill: "rgba(14, 140, 127, 0.10)", text: "#0E8C7F" },
};

export const RENTAL_STATUS_COLORS: Record<RentalStatus, BadgeColor> = {
  requested: { fill: "rgba(63, 143, 176, 0.12)", text: "#3E8FB0" },
  accepted: { fill: "rgba(14, 140, 127, 0.12)", text: "#0E8C7F" },
  active: { fill: "rgba(31, 157, 107, 0.12)", text: "#1F9D6B" },
  completed: { fill: "rgba(111, 135, 144, 0.12)", text: "#6F8790" },
  cancelled: { fill: "rgba(217, 72, 63, 0.10)", text: "#D9483F" },
};
