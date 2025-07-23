"use client"

import { useState, useEffect } from "react"
import type { Category } from "@/lib/types"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/categories")
      const result = await response.json()

      if (result.success) {
        setCategories(result.data)
        setError(null)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to fetch categories")
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData: Omit<Category, "_id" | "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      const result = await response.json()

      if (result.success) {
        setCategories((prev) => [...prev, result.data])
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Error creating category:", err)
      throw err
    }
  }

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      const result = await response.json()

      if (result.success) {
        setCategories((prev) => prev.map((category) => (category._id === categoryId ? result.data : category)))
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Error updating category:", err)
      throw err
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setCategories((prev) => prev.filter((category) => category._id !== categoryId))
        return true
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Error deleting category:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
