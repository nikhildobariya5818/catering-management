"use client"

import { useState, useEffect } from "react"
import type { Order } from "@/lib/types"

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders")
      const result = await response.json()

      if (result.success) {
        setOrders(result.data)
        setError(null)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to fetch orders")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        setOrders((prev) => [result.data, ...prev])
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Error creating order:", err)
      throw err
    }
  }

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      const result = await response.json()

      if (result.success) {
        setOrders((prev) => prev.map((order) => (order._id === orderId ? result.data : order)))
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Error updating order:", err)
      throw err
    }
  }

  const deleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setOrders((prev) => prev.filter((order) => order._id !== orderId))
        return true
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Error deleting order:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  }
}
