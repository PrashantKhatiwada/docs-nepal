import { supabase } from "./supabase"
import type { Database } from "./supabase"

type Document = Database["public"]["Tables"]["documents"]["Row"]
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"]
type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"]

export async function saveDocument(document: Omit<DocumentInsert, "user_id">) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("documents")
      .insert({
        ...document,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.code === "PGRST116") {
        console.warn("Documents table doesn't exist yet.")
        throw new Error("Database setup required. Please run the setup scripts first.")
      }
      console.error("Error saving document:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error in saveDocument:", error)
    throw error
  }
}

// Update the getUserDocuments function to handle the case where the table doesn't exist
export async function getUserDocuments() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.code === "PGRST116" || error.message.includes("does not exist")) {
        console.warn("Documents table doesn't exist yet. Returning empty array.")
        return []
      }
      console.error("Error getting user documents:", error)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserDocuments:", error)
    // Return empty array instead of throwing error
    return []
  }
}

export async function updateDocument(id: string, updates: DocumentUpdate) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.code === "PGRST116") {
        console.warn("Documents table doesn't exist yet.")
        throw new Error("Database setup required. Please run the setup scripts first.")
      }
      console.error("Error updating document:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error in updateDocument:", error)
    throw error
  }
}

export async function deleteDocument(id: string) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error("User not authenticated")
    }

    const { error } = await supabase.from("documents").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.code === "PGRST116") {
        console.warn("Documents table doesn't exist yet.")
        return // Just return silently if table doesn't exist
      }
      console.error("Error deleting document:", error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error("Error in deleteDocument:", error)
    throw error
  }
}

export async function trackTemplateUsage(templateId: string) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.warn("User not authenticated, skipping template usage tracking")
      return
    }

    const { error } = await supabase.from("template_usage").insert({
      template_id: templateId,
      user_id: user.id,
    })

    if (error) {
      console.warn("Template usage tracking failed (table may not exist):", error.message)
    }
  } catch (error) {
    console.warn("Error in trackTemplateUsage:", error)
  }
}

export async function getTemplateStats() {
  try {
    const { data, error } = await supabase.from("template_usage").select("template_id")

    if (error) {
      console.warn("Template stats not available (table may not exist):", error.message)
      return {}
    }

    // Count usage per template
    const stats = (data || []).reduce((acc: Record<string, number>, item) => {
      acc[item.template_id] = (acc[item.template_id] || 0) + 1
      return acc
    }, {})

    return stats
  } catch (error) {
    console.warn("Error in getTemplateStats:", error)
    return {}
  }
}
