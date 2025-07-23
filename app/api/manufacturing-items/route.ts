import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { ManufacturingItem } from "@/lib/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const items = await db.collection("manufacturing_items").find({}).sort({ id: 1 }).toArray()

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error("Error fetching manufacturing items:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch manufacturing items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const itemData: Omit<ManufacturingItem, "_id"> = await request.json()

    // Get the next ID
    const lastItem = await db.collection("manufacturing_items").findOne({}, { sort: { id: -1 } })

    const newItem = {
      ...itemData,
      id: lastItem ? lastItem.id + 1 : 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("manufacturing_items").insertOne(newItem)

    if (result.insertedId) {
      const insertedItem = await db.collection("manufacturing_items").findOne({ _id: result.insertedId })
      return NextResponse.json({ success: true, data: insertedItem })
    }

    return NextResponse.json({ success: false, error: "Failed to create manufacturing item" }, { status: 500 })
  } catch (error) {
    console.error("Error creating manufacturing item:", error)
    return NextResponse.json({ success: false, error: "Failed to create manufacturing item" }, { status: 500 })
  }
}
