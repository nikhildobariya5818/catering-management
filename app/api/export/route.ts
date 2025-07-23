import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    // Get all data
    const orders = await db.collection("orders").find({}).toArray()
    const categories = await db.collection("categories").find({}).toArray()
    const manufacturingItems = await db.collection("manufacturing_items").find({}).toArray()

    const exportData = {
      exportDate: new Date().toISOString(),
      orders,
      categories,
      manufacturingItems,
      totalOrders: orders.length,
      totalCategories: categories.length,
      totalManufacturingItems: manufacturingItems.length,
    }

    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="catering-data-${new Date().toISOString().split("T")[0]}.json"`,
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json({ success: false, error: "Failed to export data" }, { status: 500 })
  }
}
