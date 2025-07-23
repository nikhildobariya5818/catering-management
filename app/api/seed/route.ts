import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

const defaultCategories = [
  {
    id: 1,
    name: "માત્ર ભજિયા",
    description: "ફક્ત ભજિયાની વેરાયટી",
    items: [
      { id: 1, name: "મેથી ભજિયા", vegetables: ["મેથી", "બેસન", "તેલ"], baseQuantity: 100 },
      { id: 2, name: "મરચા ભજિયા", vegetables: ["લીલા મરચા", "બેસન", "તેલ"], baseQuantity: 80 },
      { id: 3, name: "કાંદા ભજિયા", vegetables: ["કાંદા", "બેસન", "તેલ"], baseQuantity: 120 },
      { id: 4, name: "બટાકા ભજિયા", vegetables: ["બટાકા", "બેસન", "તેલ"], baseQuantity: 150 },
      { id: 5, name: "પાલક ભજિયા", vegetables: ["પાલક", "બેસન", "તેલ"], baseQuantity: 90 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "ભજિયા સાથે ચાટ",
    description: "ભજિયા અને ચાટની વેરાયટી",
    items: [
      { id: 1, name: "મેથી ભજિયા", vegetables: ["મેથી", "બેસન", "તેલ"], baseQuantity: 100, type: "bhajiya" },
      { id: 2, name: "મરચા ભજિયા", vegetables: ["લીલા મરચા", "બેસન", "તેલ"], baseQuantity: 80, type: "bhajiya" },
      { id: 3, name: "કાંદા ભજિયા", vegetables: ["કાંદા", "બેસન", "તેલ"], baseQuantity: 120, type: "bhajiya" },
      { id: 6, name: "દહીં ચાટ", vegetables: ["દહીં", "ચણા", "ચટણી"], baseQuantity: 150, type: "chaat" },
      { id: 7, name: "કોલાપુરી ચાટ", vegetables: ["સેવ", "ચણા", "કોલાપુરી મસાલા"], baseQuantity: 120, type: "chaat" },
      { id: 8, name: "પાણી પુરી", vegetables: ["પુરી", "પાણી", "ચટણી"], baseQuantity: 200, type: "chaat" },
      { id: 9, name: "ભેલ પુરી", vegetables: ["સેવ", "મમરા", "ચટણી"], baseQuantity: 100, type: "chaat" },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "ભજિયા વિના ચાટ",
    description: "માત્ર ભજિયાની વેરાયટી (ચાટ વિના)",
    items: [
      { id: 1, name: "મેથી ભજિયા", vegetables: ["મેથી", "બેસન", "તેલ"], baseQuantity: 100 },
      { id: 2, name: "મરચા ભજિયા", vegetables: ["લીલા મરચા", "બેસન", "તેલ"], baseQuantity: 80 },
      { id: 3, name: "કાંદા ભજિયા", vegetables: ["કાંદા", "બેસન", "તેલ"], baseQuantity: 120 },
      { id: 4, name: "બટાકા ભજિયા", vegetables: ["બટાકા", "બેસન", "તેલ"], baseQuantity: 150 },
      { id: 5, name: "પાલક ભજિયા", vegetables: ["પાલક", "બેસન", "તેલ"], baseQuantity: 90 },
      { id: 10, name: "રીંગણ ભજિયા", vegetables: ["રીંગણ", "બેસન", "તેલ"], baseQuantity: 110 },
      { id: 11, name: "કારેલા ભજિયા", vegetables: ["કારેલા", "બેસન", "તેલ"], baseQuantity: 95 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const defaultManufacturingItems = [
  { id: 1, name: "ચુલો", baseQuantity: 1, per: 50, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "ગેસ બોટલ", baseQuantity: 1, per: 100, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "થાળી", baseQuantity: 1, per: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "ગ્લાસ", baseQuantity: 1, per: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "ચમચી", baseQuantity: 1, per: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: "કડાઈ", baseQuantity: 1, per: 25, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, name: "ટેબલ", baseQuantity: 1, per: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, name: "ખુરશી", baseQuantity: 1, per: 1, createdAt: new Date(), updatedAt: new Date() },
]

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("catering_management")

    // Clear existing data
    await db.collection("categories").deleteMany({})
    await db.collection("manufacturing_items").deleteMany({})

    // Insert default data
    await db.collection("categories").insertMany(defaultCategories)
    await db.collection("manufacturing_items").insertMany(defaultManufacturingItems)

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}
