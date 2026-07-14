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
          location: string | null;
          condition: string | null;
          latitude: number | null;
          longitude: number | null;
          area: number | null;
          bedrooms: number | null;
          address: string | null;
          brand: string | null;
          model: string | null;
          year: number | null;
          service_type: string | null;
          duration: string | null;
          spot_number: string | null;
          building_id: string | null;
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
          location?: string | null;
          condition?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          area?: number | null;
          bedrooms?: number | null;
          address?: string | null;
          brand?: string | null;
          model?: string | null;
          year?: number | null;
          service_type?: string | null;
          duration?: string | null;
          spot_number?: string | null;
          building_id?: string | null;
        };
        Update: {
          item_kind?: ItemKind;
          title?: string;
          description?: string | null;
          base_price?: number | null;
          price_unit?: PriceUnit | null;
          status?: ItemStatus;
          category_id?: string | null;
          location?: string | null;
          condition?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          area?: number | null;
          bedrooms?: number | null;
          address?: string | null;
          brand?: string | null;
          model?: string | null;
          year?: number | null;
          service_type?: string | null;
          duration?: string | null;
          spot_number?: string | null;
          building_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "items_building_id_fkey";
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
    Functions: Record<string, never>;
  };
}

export type Person = Database["public"]["Tables"]["people"]["Row"];
// Aliased as CategoryRow, not Category, to avoid clashing with the Category
// string union in types/domain.ts.
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type Building = Database["public"]["Tables"]["buildings"]["Row"];
export type Item = Database["public"]["Tables"]["items"]["Row"];
export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type Availability = Database["public"]["Tables"]["availability"]["Row"];
export type Rental = Database["public"]["Tables"]["rentals"]["Row"];
export type RentalItem = Database["public"]["Tables"]["rental_items"]["Row"];
