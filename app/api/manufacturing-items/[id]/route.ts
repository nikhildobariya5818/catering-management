import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    const result = await db.collection("manufacturing_items").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Manufacturing item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Manufacturing item deleted successfully" })
  } catch (error) {
    console.error("Error deleting manufacturing item:", error)
    return NextResponse.json({ success: false, error: "Failed to delete manufacturing item" }, { status: 500 })
  }
}
