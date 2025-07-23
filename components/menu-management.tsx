"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit } from "lucide-react"

const defaultMenuItems = [
  { id: 1, name: "ભરેલા રિંગા", category: "મુખ્ય વાનગી", baseQuantity: "250g", materials: ["રિંગા", "મસાલા", "તેલ"] },
  { id: 2, name: "કઢીપાકી", category: "મુખ્ય વાનગી", baseQuantity: "200ml", materials: ["દહીં", "બેસન", "મસાલા"] },
  { id: 3, name: "કાંદાના પકોડા", category: "નાસ્તો", baseQuantity: "100g", materials: ["કાંદા", "બેસન", "તેલ"] },
  { id: 4, name: "ગુલાબ જામુન", category: "મીઠાઈ", baseQuantity: "2 પીસ", materials: ["ખોવા", "ખાંડ", "ઘી"] },
  { id: 5, name: "રોટલી", category: "રોટલી", baseQuantity: "3 પીસ", materials: ["લોટ", "તેલ", "મીઠું"] },
  { id: 6, name: "ચોખા", category: "મુખ્ય વાનગી", baseQuantity: "150g", materials: ["ચોખા", "પાણી", "મીઠું"] },
  { id: 7, name: "દાળ", category: "મુખ્ય વાનગી", baseQuantity: "100ml", materials: ["તુવેર દાળ", "મસાલા", "ઘી"] },
  { id: 8, name: "શાક", category: "મુખ્ય વાનગી", baseQuantity: "100g", materials: ["શાકભાજી", "મસાલા", "તેલ"] },
  { id: 9, name: "છાસ", category: "પીણું", baseQuantity: "200ml", materials: ["દહીં", "પાણી", "મીઠું", "જીરું"] },
  { id: 10, name: "પાપડ", category: "સાઇડ ડિશ", baseQuantity: "2 પીસ", materials: ["પાપડ", "તેલ"] },
]

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState(defaultMenuItems)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    baseQuantity: "",
    materials: "",
  })
  const [isEditing, setIsEditing] = useState(false)

  const categories = ["મુખ્ય વાનગી", "નાસ્તો", "મીઠાઈ", "રોટલી", "પીણું", "સાઇડ ડિશ"]

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.baseQuantity) {
      const item = {
        id: Date.now(),
        name: newItem.name,
        category: newItem.category,
        baseQuantity: newItem.baseQuantity,
        materials: newItem.materials
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m),
      }
      setMenuItems([...menuItems, item])
      setNewItem({ name: "", category: "", baseQuantity: "", materials: "" })
    }
  }

  const handleDeleteItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const getCategoryColor = (category) => {
    const colors = {
      "મુખ્ય વાનગી": "bg-blue-100 text-blue-800",
      નાસ્તો: "bg-green-100 text-green-800",
      મીઠાઈ: "bg-pink-100 text-pink-800",
      રોટલી: "bg-yellow-100 text-yellow-800",
      પીણું: "bg-purple-100 text-purple-800",
      "સાઇડ ડિશ": "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            નવી મેન્યુ આઇટમ ઉમેરો
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="itemName">વાનગીનું નામ</Label>
              <Input
                id="itemName"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="વાનગીનું નામ"
              />
            </div>
            <div>
              <Label htmlFor="category">કેટેગરી</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="">કેટેગરી પસંદ કરો</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="baseQuantity">બેઝ ક્વોન્ટિટી</Label>
              <Input
                id="baseQuantity"
                value={newItem.baseQuantity}
                onChange={(e) => setNewItem({ ...newItem, baseQuantity: e.target.value })}
                placeholder="દા.ત. 250g, 2 પીસ"
              />
            </div>
            <div>
              <Label htmlFor="materials">સામગ્રી (કોમા વડે અલગ કરો)</Label>
              <Input
                id="materials"
                value={newItem.materials}
                onChange={(e) => setNewItem({ ...newItem, materials: e.target.value })}
                placeholder="સામગ્રી 1, સામગ્રી 2"
              />
            </div>
          </div>
          <Button onClick={handleAddItem} className="mt-4 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            આઇટમ ઉમેરો
          </Button>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      <div className="grid gap-4">
        {categories.map((category) => {
          const categoryItems = menuItems.filter((item) => item.category === category)
          if (categoryItems.length === 0) return null

          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category}</span>
                  <Badge variant="secondary">{categoryItems.length} આઇટમ્સ</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {categoryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                          <span className="text-sm text-gray-600">({item.baseQuantity})</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-sm text-gray-500">સામગ્રી: </span>
                          <span className="text-sm">{item.materials.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
