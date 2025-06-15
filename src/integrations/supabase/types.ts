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
      balance_history: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          id: string
          transaction_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "balance_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balance_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      digiflazz_config: {
        Row: {
          api_key: string
          created_at: string
          id: string
          mode: string
          username: string
        }
        Insert: {
          api_key: string
          created_at: string
          id: string
          mode: string
          username: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          mode?: string
          username?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          buyer_price: number
          buyer_sku_code: string | null
          category: string
          created_at: string | null
          description: string | null
          end_cut_off: string | null
          id: string
          is_active: boolean | null
          product_name: string
          seller_price: number
          sku: string
          start_cut_off: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          brand: string
          buyer_price: number
          buyer_sku_code?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          end_cut_off?: string | null
          id?: string
          is_active?: boolean | null
          product_name: string
          seller_price: number
          sku: string
          start_cut_off?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          brand?: string
          buyer_price?: number
          buyer_sku_code?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          end_cut_off?: string | null
          id?: string
          is_active?: boolean | null
          product_name?: string
          seller_price?: number
          sku?: string
          start_cut_off?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      pulsa_products: {
        Row: {
          buyer_sku_code: string
          created_at: string
          id: string
          is_active: boolean | null
          nominal: number
          operator: string
          price: number
          product_name: string
          updated_at: string
        }
        Insert: {
          buyer_sku_code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          nominal: number
          operator: string
          price: number
          product_name: string
          updated_at?: string
        }
        Update: {
          buyer_sku_code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          nominal?: number
          operator?: string
          price?: number
          product_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      pulsa_transactions: {
        Row: {
          created_at: string
          digiflazz_trx_id: string | null
          id: string
          message: string | null
          nominal: number
          operator: string
          phone_number: string
          price: number
          product_name: string
          ref_id: string
          serial_number: string | null
          sku: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          digiflazz_trx_id?: string | null
          id?: string
          message?: string | null
          nominal: number
          operator: string
          phone_number: string
          price: number
          product_name: string
          ref_id: string
          serial_number?: string | null
          sku: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          digiflazz_trx_id?: string | null
          id?: string
          message?: string | null
          nominal?: number
          operator?: string
          phone_number?: string
          price?: number
          product_name?: string
          ref_id?: string
          serial_number?: string | null
          sku?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      topup_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string | null
          id: string
          payment_method: string
          proof_image: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string | null
          id?: string
          payment_method: string
          proof_image?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string
          proof_image?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topup_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          balance_after: number | null
          balance_before: number | null
          created_at: string | null
          customer_id: string
          digiflazz_trx_id: string | null
          id: string
          message: string | null
          price: number
          product_name: string
          rc: string | null
          ref_id: string
          serial_number: string | null
          sku: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string | null
          customer_id: string
          digiflazz_trx_id?: string | null
          id?: string
          message?: string | null
          price: number
          product_name: string
          rc?: string | null
          ref_id: string
          serial_number?: string | null
          sku: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string | null
          customer_id?: string
          digiflazz_trx_id?: string | null
          id?: string
          message?: string | null
          price?: number
          product_name?: string
          rc?: string | null
          ref_id?: string
          serial_number?: string | null
          sku?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transaksi_digiflazz: {
        Row: {
          buyer_last_saldo: string
          buyer_sku_code: string
          customer_no: string
          id: number
          message: string
          price: number
          rc: string
          ref_id: string
          ref_id_digiflazz: string | null
          sn: string
          status: string
          tele: string
          updated_at: string | null
          wa: string
        }
        Insert: {
          buyer_last_saldo: string
          buyer_sku_code: string
          customer_no: string
          id?: never
          message: string
          price: number
          rc: string
          ref_id: string
          ref_id_digiflazz?: string | null
          sn: string
          status: string
          tele: string
          updated_at?: string | null
          wa: string
        }
        Update: {
          buyer_last_saldo?: string
          buyer_sku_code?: string
          customer_no?: string
          id?: never
          message?: string
          price?: number
          rc?: string
          ref_id?: string
          ref_id_digiflazz?: string | null
          sn?: string
          status?: string
          tele?: string
          updated_at?: string | null
          wa?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_balance: {
        Args: {
          p_user_id: string
          p_amount: number
          p_type: string
          p_description?: string
          p_transaction_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
