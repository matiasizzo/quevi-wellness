// Tipos generados manualmente desde el schema.sql
// Cuando el proyecto esté en Supabase, ejecutar:
//   npx supabase gen types typescript --project-id <ID> > lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id:         string
          name:       string
          email:      string
          phone:      string | null
          service:    string | null
          message:    string | null
          status:     string
          created_at: string
          // Atribución de campaña — ver supabase/attribution.sql
          gclid:        string | null
          wbraid:       string | null
          gbraid:       string | null
          utm_source:   string | null
          utm_medium:   string | null
          utm_campaign: string | null
          landing_page: string | null
          locale:       string | null
          source:       string | null
        }
        Insert: {
          id?:        string
          name:       string
          email:      string
          phone?:     string | null
          service?:   string | null
          message?:   string | null
          status?:    string
          created_at?: string
          gclid?:        string | null
          wbraid?:       string | null
          gbraid?:       string | null
          utm_source?:   string | null
          utm_medium?:   string | null
          utm_campaign?: string | null
          landing_page?: string | null
          locale?:       string | null
          source?:       string | null
        }
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
        Relationships: []
      }
      products: {
        Row: {
          id:                 string
          category_id:        string | null
          name:               string
          slug:               string
          tagline:            string | null
          description:        string | null
          ingredients:        string | null
          usage_instructions: string | null
          dosage:             string | null
          frequency:          string | null
          storage:            string | null
          shelf_life_months:  number | null
          skin_type:          string[] | null
          volume_ml:          number | null
          active:             boolean
          featured:           boolean
          available_on:       string[]
          image_url:          string | null
          created_at:         string
          updated_at:         string
        }
        Insert: Partial<Database['public']['Tables']['products']['Row']> & {
          name: string
          slug: string
        }
        Update: Partial<Database['public']['Tables']['products']['Row']>
        Relationships: []
      }
      product_variants: {
        Row: {
          id:               string
          product_id:       string
          name:             string
          price_cents:      number
          compare_at_cents: number | null
          stripe_price_id:  string | null
          stock_quantity:   number
          is_default:       boolean
          active:           boolean
          created_at:       string
        }
        Insert: Partial<Database['public']['Tables']['product_variants']['Row']> & {
          product_id:  string
          name:        string
          price_cents: number
        }
        Update: Partial<Database['public']['Tables']['product_variants']['Row']>
        Relationships: []
      }
      orders: {
        Row: {
          id:                       string
          store_id:                 string | null
          customer_id:              string | null
          status:                   string
          subtotal_cents:           number
          shipping_cents:           number
          total_cents:              number
          stripe_payment_intent_id: string | null
          shipping_address:         Json | null
          notes:                    string | null
          created_at:               string
          updated_at:               string
        }
        Insert: Partial<Database['public']['Tables']['orders']['Row']> & {
          subtotal_cents: number
          total_cents:    number
        }
        Update: Partial<Database['public']['Tables']['orders']['Row']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
