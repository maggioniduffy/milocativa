/**
 * Hand-written until `supabase gen types typescript` is wired to a live
 * project (see progress-tracker.md Next Up) — keep in sync with
 * supabase/migrations by hand until then. Shape (Tables/Views/Functions,
 * Relationships) matches what @supabase/supabase-js's generic client expects.
 */
export interface Database {
  public: {
    Tables: {
      people: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type Person = Database["public"]["Tables"]["people"]["Row"];
