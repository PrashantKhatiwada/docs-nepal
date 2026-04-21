export interface DocumentRow {
  id: string
  user_id: string
  template_id: string
  title: string
  form_data: Record<string, any>
  language: string
  created_at: string
  updated_at: string
}

export interface DocumentInsert {
  template_id: string
  title: string
  form_data: Record<string, any>
  language: string
}

export interface DocumentUpdate {
  title?: string
  form_data?: Record<string, any>
  language?: string
}
