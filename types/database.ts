export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type HabitEntryStatus = "positive" | "negative";

export type HabitStatus = HabitEntryStatus | null;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
          position: number;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string | null;
          position?: number;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string | null;
          position?: number;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      habit_entries: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          date: string;
          status: HabitEntryStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          date: string;
          status: HabitEntryStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          date?: string;
          status?: HabitEntryStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitEntry = Database["public"]["Tables"]["habit_entries"]["Row"];

export type HabitWithStats = Habit & {
  positiveCount: number;
  negativeCount: number;
  blankCount: number;
  positiveRate: number;
  entries: Record<string, HabitEntryStatus>;
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
