import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const order = await db.collection("orders").findOne({
      _id: new ObjectId(params.id),
    })

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const updateData = await request.json()

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    const updatedOrder = await db.collection("orders").findOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json({ success: true, data: updatedOrder })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const result = await db.collection("orders").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 })
  }
}
