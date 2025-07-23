import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function DELETE() {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    // Clear all collections
    await db.collection("orders").deleteMany({})
    await db.collection("categories").deleteMany({})
    await db.collection("manufacturing_items").deleteMany({})

    return NextResponse.json({
      success: true,
      message: "All data cleared successfully",
    })
  } catch (error) {
    console.error("Error clearing data:", error)
    return NextResponse.json({ success: false, error: "Failed to clear data" }, { status: 500 })
  }
}
