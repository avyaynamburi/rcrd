export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      access_audit: {
        Row: {
          action: string;
          actor_id: string;
          after_data: Json | null;
          area: string;
          before_data: Json | null;
          center_id: string | null;
          created_at: string;
          id: string;
          org_id: string;
          record_id: string;
          source: string;
        };
        ComputedFields: never;
        Insert: {
          action: string;
          actor_id: string;
          after_data?: Json | null;
          area?: string;
          before_data?: Json | null;
          center_id?: string | null;
          created_at?: string;
          id?: string;
          org_id: string;
          record_id: string;
          source?: string;
        };
        Update: {
          action?: string;
          actor_id?: string;
          after_data?: Json | null;
          area?: string;
          before_data?: Json | null;
          center_id?: string | null;
          created_at?: string;
          id?: string;
          org_id?: string;
          record_id?: string;
          source?: string;
        };
        Relationships: [
          {
            foreignKeyName: "access_audit_org_id_center_id_fkey";
            columns: ["org_id", "center_id"];
            isOneToOne: false;
            referencedRelation: "centers";
            referencedColumns: ["org_id", "id"];
          },
          {
            foreignKeyName: "access_audit_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["org_id"];
          },
        ];
      };
      center_grants: {
        Row: {
          center_id: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          external_id: string | null;
          external_source: string | null;
          id: string;
          membership_id: string;
          org_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        ComputedFields: never;
        Insert: {
          center_id: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          membership_id: string;
          org_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          center_id?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          membership_id?: string;
          org_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "center_grants_org_id_center_id_fkey";
            columns: ["org_id", "center_id"];
            isOneToOne: false;
            referencedRelation: "centers";
            referencedColumns: ["org_id", "id"];
          },
          {
            foreignKeyName: "center_grants_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["org_id"];
          },
          {
            foreignKeyName: "center_grants_org_id_membership_id_fkey";
            columns: ["org_id", "membership_id"];
            isOneToOne: false;
            referencedRelation: "memberships";
            referencedColumns: ["org_id", "id"];
          },
        ];
      };
      centers: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          external_id: string | null;
          external_source: string | null;
          id: string;
          name: string;
          org_id: string;
          timezone: string;
          updated_at: string;
          updated_by: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          name: string;
          org_id: string;
          timezone?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          name?: string;
          org_id?: string;
          timezone?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "centers_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["org_id"];
          },
        ];
      };
      memberships: {
        Row: {
          access_grid: Json | null;
          appointment_visibility: string;
          base_role: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          export_disabled: boolean;
          external_id: string | null;
          external_source: string | null;
          id: string;
          is_owner: boolean;
          login_enabled: boolean;
          mobile_access_enabled: boolean;
          org_id: string;
          role_tags: string[];
          updated_at: string;
          updated_by: string | null;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          access_grid?: Json | null;
          appointment_visibility?: string;
          base_role?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          export_disabled?: boolean;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          is_owner?: boolean;
          login_enabled?: boolean;
          mobile_access_enabled?: boolean;
          org_id: string;
          role_tags?: string[];
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          access_grid?: Json | null;
          appointment_visibility?: string;
          base_role?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          export_disabled?: boolean;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          is_owner?: boolean;
          login_enabled?: boolean;
          mobile_access_enabled?: boolean;
          org_id?: string;
          role_tags?: string[];
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memberships_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["org_id"];
          },
        ];
      };
      operatories: {
        Row: {
          center_id: string;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          external_id: string | null;
          external_source: string | null;
          id: string;
          name: string;
          org_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        ComputedFields: never;
        Insert: {
          center_id: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          name: string;
          org_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          center_id?: string;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          name?: string;
          org_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "operatories_org_id_center_id_fkey";
            columns: ["org_id", "center_id"];
            isOneToOne: false;
            referencedRelation: "centers";
            referencedColumns: ["org_id", "id"];
          },
          {
            foreignKeyName: "operatories_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organisations";
            referencedColumns: ["org_id"];
          },
        ];
      };
      organisations: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          external_id: string | null;
          external_source: string | null;
          id: string;
          name: string;
          org_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          name: string;
          org_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          external_id?: string | null;
          external_source?: string | null;
          id?: string;
          name?: string;
          org_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      audit_password_verification: { Args: { event: Json }; Returns: Json };
      auth_org_id: { Args: Record<PropertyKey, never>; Returns: string };
      can_access_center: {
        Args: { target_center_id: string };
        Returns: boolean;
      };
      can_export: { Args: Record<PropertyKey, never>; Returns: boolean };
      can_manage_logins: { Args: Record<PropertyKey, never>; Returns: boolean };
      can_see_appointment: {
        Args: {
          appointment_center_id: string;
          appointment_org_id: string;
          doctor_user_id: string;
        };
        Returns: boolean;
      };
      list_appointment_visibility: {
        Args: Record<PropertyKey, never>;
        Returns: {
          appointment_visibility: string;
          id: string;
        }[];
      };
      list_center_access: { Args: Record<PropertyKey, never>; Returns: Json };
      list_export_disabled: {
        Args: Record<PropertyKey, never>;
        Returns: {
          export_disabled: boolean;
          id: string;
        }[];
      };
      list_login_accounts: {
        Args: Record<PropertyKey, never>;
        Returns: {
          email: string;
          id: string;
          is_owner: boolean;
          login_enabled: boolean;
          mobile_access_enabled: boolean;
        }[];
      };
      list_member_access: {
        Args: Record<PropertyKey, never>;
        Returns: {
          access_grid: Json;
          id: string;
        }[];
      };
      list_member_roles: {
        Args: Record<PropertyKey, never>;
        Returns: {
          base_role: string;
          id: string;
          role_tags: string[];
        }[];
      };
      list_member_stamps: { Args: Record<PropertyKey, never>; Returns: Json };
      record_audit_export: {
        Args: { export_format: string; page_number: number };
        Returns: undefined;
      };
      set_appointment_visibility: {
        Args: { target_membership_id: string; visibility: string };
        Returns: undefined;
      };
      set_export_disabled: {
        Args: { disabled: boolean; target_membership_id: string };
        Returns: undefined;
      };
      set_login_access: {
        Args: {
          enabled: boolean;
          mobile_enabled: boolean;
          target_membership_id: string;
        };
        Returns: undefined;
      };
      set_member_access: {
        Args: { new_grid: Json; target_membership_id: string };
        Returns: undefined;
      };
      set_member_centers: {
        Args: { center_ids: string[]; target_membership_id: string };
        Returns: undefined;
      };
      set_member_role: {
        Args: {
          new_role: string;
          new_tags: string[];
          target_membership_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
