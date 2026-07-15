/**
 * Hand-written until `supabase gen types typescript` is wired to a live
 * project (see progress-tracker.md Next Up) — keep in sync with
 * supabase/migrations by hand until then. Shape (Tables/Views/Functions,
 * Relationships) matches what @supabase/supabase-js's generic client expects.
 */

/** Mirrors the CHECK constraints in supabase/migrations. */
export type CategoryItemType = "estate" | "machinery" | "service";
export type ItemKind = "estate" | "machinery" | "service" | "parking_spot";
export type ItemStatus = "draft" | "available" | "rented" | "archived";
export type PriceUnit = "month" | "day" | "service" | "hour" | "unit";
export type ListingStatus = "draft" | "published" | "archived";
/** DB spelling of RentalStatus (types/domain.ts) — same values. */
export type RentalStatusDb =
  | "requested"
  | "accepted"
  | "active"
  | "completed"
  | "cancelled";

/**
 * Shape of buildings.floors_data — the physical cross-section for
 * components/building/buildingDiagram.tsx. Published units carry an `item_id`
 * back to an `items` row; "external" (not-published) units have none. Kept in
 * sync with content/building.ts BuildingDetail by hand.
 */
export interface BuildingUnitSlot {
  id: string;
  name: string;
  item_id: string | null;
  status: string | null;
  note?: string;
}
export interface BuildingFloorLayout {
  label: string;
  units: BuildingUnitSlot[];
}
export interface BuildingFloorsData {
  floors?: BuildingFloorLayout[];
  parking?: BuildingUnitSlot[];
}

export interface Database {
  public: {
    Tables: {
      people: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          company_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          company_name?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          company_name?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          item_type: CategoryItemType;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          item_type: CategoryItemType;
        };
        Update: {
          name?: string;
          slug?: string;
          item_type?: CategoryItemType;
        };
        Relationships: [];
      };
      buildings: {
        Row: {
          id: string;
          name: string;
          slug: string;
          address: string;
          description: string | null;
          floors_data: BuildingFloorsData;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          address: string;
          description?: string | null;
          floors_data?: BuildingFloorsData;
        };
        Update: {
          name?: string;
          slug?: string;
          address?: string;
          description?: string | null;
          floors_data?: BuildingFloorsData;
        };
        Relationships: [];
      };
      // Class-table inheritance since 0011: `items` carries only the common
      // columns; per-subtype fields live in estates/machinery/services/
      // parking_spots, 1:1 via item_id.
      items: {
        Row: {
          id: string;
          item_kind: ItemKind;
          title: string;
          description: string | null;
          base_price: number | null;
          price_unit: PriceUnit | null;
          status: ItemStatus;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_kind: ItemKind;
          title: string;
          description?: string | null;
          base_price?: number | null;
          price_unit?: PriceUnit | null;
          status?: ItemStatus;
          category_id?: string | null;
        };
        Update: {
          item_kind?: ItemKind;
          title?: string;
          description?: string | null;
          base_price?: number | null;
          price_unit?: PriceUnit | null;
          status?: ItemStatus;
          category_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      estates: {
        Row: {
          item_id: string;
          area: number | null;
          bedrooms: number | null;
          address: string | null;
          location: string | null;
          condition: string | null;
          latitude: number | null;
          longitude: number | null;
          building_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          item_id: string;
          area?: number | null;
          bedrooms?: number | null;
          address?: string | null;
          location?: string | null;
          condition?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          building_id?: string | null;
        };
        Update: {
          area?: number | null;
          bedrooms?: number | null;
          address?: string | null;
          location?: string | null;
          condition?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          building_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "estates_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "estates_building_id_fkey";
            columns: ["building_id"];
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
        ];
      };
      machinery: {
        Row: {
          item_id: string;
          brand: string | null;
          model: string | null;
          year: number | null;
          location: string | null;
          condition: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          item_id: string;
          brand?: string | null;
          model?: string | null;
          year?: number | null;
          location?: string | null;
          condition?: string | null;
        };
        Update: {
          brand?: string | null;
          model?: string | null;
          year?: number | null;
          location?: string | null;
          condition?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "machinery_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          item_id: string;
          service_type: string | null;
          duration: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          item_id: string;
          service_type?: string | null;
          duration?: string | null;
        };
        Update: {
          service_type?: string | null;
          duration?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "services_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
        ];
      };
      parking_spots: {
        Row: {
          item_id: string;
          spot_number: string | null;
          location: string | null;
          condition: string | null;
          building_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          item_id: string;
          spot_number?: string | null;
          location?: string | null;
          condition?: string | null;
          building_id?: string | null;
        };
        Update: {
          spot_number?: string | null;
          location?: string | null;
          condition?: string | null;
          building_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "parking_spots_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parking_spots_building_id_fkey";
            columns: ["building_id"];
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
        ];
      };
      listings: {
        Row: {
          id: string;
          item_id: string;
          admin_id: string;
          status: ListingStatus;
          featured: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          admin_id: string;
          status?: ListingStatus;
          featured?: boolean;
          published_at?: string | null;
        };
        Update: {
          item_id?: string;
          admin_id?: string;
          status?: ListingStatus;
          featured?: boolean;
          published_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "listings_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listings_admin_id_fkey";
            columns: ["admin_id"];
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
        ];
      };
      availability: {
        Row: {
          id: string;
          item_id: string;
          start_date: string;
          end_date: string;
          is_booked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          start_date: string;
          end_date: string;
          is_booked?: boolean;
        };
        Update: {
          item_id?: string;
          start_date?: string;
          end_date?: string;
          is_booked?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "availability_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
        ];
      };
      rentals: {
        Row: {
          id: string;
          user_id: string;
          status: RentalStatusDb;
          start_date: string | null;
          end_date: string | null;
          total_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: RentalStatusDb;
          start_date?: string | null;
          end_date?: string | null;
          total_amount?: number | null;
        };
        Update: {
          status?: RentalStatusDb;
          start_date?: string | null;
          end_date?: string | null;
          total_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "rentals_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
        ];
      };
      rental_items: {
        Row: {
          id: string;
          rental_id: string;
          item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          rental_id: string;
          item_id: string;
        };
        Update: {
          rental_id?: string;
          item_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rental_items_rental_id_fkey";
            columns: ["rental_id"];
            referencedRelation: "rentals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rental_items_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
        ];
      };
      /**
       * Not migrated yet (chat isn't built — see architecture-context.md's
       * Communication model). Declared here only so `hooks/useConversation.ts`,
       * written ahead of the migration, still type-checks against the shape
       * it already assumes.
       */
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          sent_at: string;
          read_at: string | null;
        };
        Insert: {
          conversation_id: string;
          sender_id: string;
          body: string;
        };
        Update: {
          read_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      /**
       * 0012 — atomic write of an `items` row + its 1:1 subtype row (the JS
       * client can't open a transaction). SECURITY INVOKER, so the admin-only
       * RLS policies still gate every write. Returns the item id.
       */
      save_item_with_subtype: {
        Args: {
          p_item_id: string | null;
          p_item: Record<string, string | null>;
          p_subtype: Record<string, string | null>;
        };
        Returns: string;
      };
    };
  };
}

export type Person = Database["public"]["Tables"]["people"]["Row"];
// Aliased as CategoryRow, not Category, to avoid clashing with the Category
// string union in types/domain.ts.
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type Building = Database["public"]["Tables"]["buildings"]["Row"];
export type Item = Database["public"]["Tables"]["items"]["Row"];
export type EstateRow = Database["public"]["Tables"]["estates"]["Row"];
export type MachineryRow = Database["public"]["Tables"]["machinery"]["Row"];
export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type ParkingSpotRow = Database["public"]["Tables"]["parking_spots"]["Row"];
export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type Availability = Database["public"]["Tables"]["availability"]["Row"];
export type Rental = Database["public"]["Tables"]["rentals"]["Row"];
export type RentalItem = Database["public"]["Tables"]["rental_items"]["Row"];
