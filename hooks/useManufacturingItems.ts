"use client"

import { useState, useEffect } from "react"
import type { ManufacturingItem } from "@/lib/types"

export function useManufacturingItems() {
  const [items, setItems] = useState<ManufacturingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/manufacturing-items")
      const result = await response.json()

      if (result.success) {
        setItems(result.data)
        setError(null)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to fetch manufacturing items")
      console.error("Error fetching manufacturing items:", err)
    } finally {
      setLoading(false)
    }
  }

  const createItem = async (itemData: Omit<ManufacturingItem, "_id" | "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/manufacturing-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      })

      const result = await response.json()

      if (result.success) {
        setItems((prev) => [...prev, result.data])
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Error creating manufacturing item:", err)
      throw err
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/manufacturing-items/${itemId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setItems((prev) => prev.filter((item) => item._id !== itemId))
        return true
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Error deleting manufacturing item:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    deleteItem,
  }
}
