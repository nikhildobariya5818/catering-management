import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Order } from "@/lib/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const orderData: Omit<Order, "_id"> = await request.json()

    // Add timestamps
    const newOrder = {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(newOrder)

    if (result.insertedId) {
      const insertedOrder = await db.collection("orders").findOne({ _id: result.insertedId })
      return NextResponse.json({ success: true, data: insertedOrder })
    }

    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
