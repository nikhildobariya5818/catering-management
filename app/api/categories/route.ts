import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Category } from "@/lib/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const categories = await db.collection("categories").find({}).sort({ id: 1 }).toArray()

    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const categoryData: Omit<Category, "_id"> = await request.json()

    // Get the next ID
    const lastCategory = await db.collection("categories").findOne({}, { sort: { id: -1 } })

    const newCategory = {
      ...categoryData,
      id: lastCategory ? lastCategory.id + 1 : 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("categories").insertOne(newCategory)

    if (result.insertedId) {
      const insertedCategory = await db.collection("categories").findOne({ _id: result.insertedId })
      return NextResponse.json({ success: true, data: insertedCategory })
    }

    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
}
