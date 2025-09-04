export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      atj_treaty_signatories: {
        Row: {
          country: string
          created_at: string
          id: string
          name: string
          representative_name: string | null
          representative_title: string | null
          type: Database["public"]["Enums"]["signatory_type"]
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          name: string
          representative_name?: string | null
          representative_title?: string | null
          type: Database["public"]["Enums"]["signatory_type"]
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          name?: string
          representative_name?: string | null
          representative_title?: string | null
          type?: Database["public"]["Enums"]["signatory_type"]
        }
        Relationships: []
      }
      connection_contributions: {
        Row: {
          connection_contact: string
          connection_name: string
          created_at: string
          id: string
          reason: string
          your_email: string
          your_name: string
        }
        Insert: {
          connection_contact: string
          connection_name: string
          created_at?: string
          id?: string
          reason: string
          your_email: string
          your_name: string
        }
        Update: {
          connection_contact?: string
          connection_name?: string
          created_at?: string
          id?: string
          reason?: string
          your_email?: string
          your_name?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          newsletter_email: string | null
          organization: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          newsletter_email?: string | null
          organization?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          newsletter_email?: string | null
          organization?: string | null
        }
        Relationships: []
      }
      idea_contributions: {
        Row: {
          created_at: string
          description: string
          email: string
          id: string
          name: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          email: string
          id?: string
          name: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          email?: string
          id?: string
          name?: string
          title?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      page_visits: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          page_title: string | null
          page_url: string
          referrer: string | null
          session_id: string
          time_on_page: number | null
          user_agent: string | null
          visit_end: string | null
          visit_start: string
          visitor_ip: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          page_title?: string | null
          page_url: string
          referrer?: string | null
          session_id: string
          time_on_page?: number | null
          user_agent?: string | null
          visit_end?: string | null
          visit_start?: string
          visitor_ip: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          page_title?: string | null
          page_url?: string
          referrer?: string | null
          session_id?: string
          time_on_page?: number | null
          user_agent?: string | null
          visit_end?: string | null
          visit_start?: string
          visitor_ip?: string
        }
        Relationships: []
      }
      problem_contributions: {
        Row: {
          created_at: string
          description: string
          email: string
          id: string
          name: string
          problem_area: string
        }
        Insert: {
          created_at?: string
          description: string
          email: string
          id?: string
          name: string
          problem_area: string
        }
        Update: {
          created_at?: string
          description?: string
          email?: string
          id?: string
          name?: string
          problem_area?: string
        }
        Relationships: []
      }
      time_contributions: {
        Row: {
          availability: string
          created_at: string
          email: string
          expertise: string
          id: string
          name: string
        }
        Insert: {
          availability: string
          created_at?: string
          email: string
          expertise: string
          id?: string
          name: string
        }
        Update: {
          availability?: string
          created_at?: string
          email?: string
          expertise?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_sessions: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          first_page: string
          id: string
          last_page: string | null
          session_end: string | null
          session_id: string
          session_start: string
          total_pages_visited: number | null
          total_session_time: number | null
          user_agent: string | null
          visitor_ip: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          first_page: string
          id?: string
          last_page?: string | null
          session_end?: string | null
          session_id: string
          session_start?: string
          total_pages_visited?: number | null
          total_session_time?: number | null
          user_agent?: string | null
          visitor_ip: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          first_page?: string
          id?: string
          last_page?: string | null
          session_end?: string | null
          session_id?: string
          session_start?: string
          total_pages_visited?: number | null
          total_session_time?: number | null
          user_agent?: string | null
          visitor_ip?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      make_first_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      make_user_admin_by_email: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      signatory_type: "individual" | "organization"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      signatory_type: ["individual", "organization"],
      user_role: ["admin", "user"],
    },
  },
} as const
