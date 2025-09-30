export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'client' | 'coach'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'client' | 'coach'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'client' | 'coach'
          created_at?: string
          updated_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          user_id: string
          date: string
          energy: number
          stress: number
          mood: number
          sleep: number
          focus: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          energy: number
          stress: number
          mood: number
          sleep: number
          focus: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          energy?: number
          stress?: number
          mood?: number
          sleep?: number
          focus?: number
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          category: 'business' | 'health' | 'relationships'
          title: string
          description: string
          target_date: string
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: 'business' | 'health' | 'relationships'
          title: string
          description?: string
          target_date: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: 'business' | 'health' | 'relationships'
          title?: string
          description?: string
          target_date?: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      reflections: {
        Row: {
          id: string
          user_id: string
          question: string
          answer: string
          summary: string
          week_start_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question: string
          answer?: string
          summary?: string
          week_start_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question?: string
          answer?: string
          summary?: string
          week_start_date?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          coach_id: string
          client_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          coach_id: string
          client_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          coach_id?: string
          client_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          coach_id: string
          client_id: string
          title: string
          description: string
          due_date: string
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          coach_id: string
          client_id: string
          title: string
          description?: string
          due_date: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          coach_id?: string
          client_id?: string
          title?: string
          description?: string
          due_date?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          client_id: string
          alert_type: 'low_energy' | 'high_stress' | 'goal_delay'
          message: string
          acknowledged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          alert_type: 'low_energy' | 'high_stress' | 'goal_delay'
          message: string
          acknowledged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          alert_type?: 'low_energy' | 'high_stress' | 'goal_delay'
          message?: string
          acknowledged?: boolean
          created_at?: string
        }
      }
    }
  }
}
