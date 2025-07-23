"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calculator, Users, ShoppingCart } from "lucide-react"

const menuItems = [
  {
    id: 1,
    name: "ભરેલા રિંગા",
    baseQuantity: 250,
    unit: "g",
    materials: [
      { name: "રિંગા", quantity: 300, unit: "g" },
      { name: "મસાલા", quantity: 50, unit: "g" },
      { name: "તેલ", quantity: 30, unit: "ml" },
    ],
  },
  {
    id: 2,
    name: "કઢીપાકી",
    baseQuantity: 200,
    unit: "ml",
    materials: [
      { name: "દહીં", quantity: 100, unit: "g" },
      { name: "બેસન", quantity: 25, unit: "g" },
      { name: "મસાલા", quantity: 10, unit: "g" },
    ],
  },
  {
    id: 3,
    name: "કાંદાના પકોડા",
    baseQuantity: 100,
    unit: "g",
    materials: [
      { name: "કાંદા", quantity: 80, unit: "g" },
      { name: "બેસન", quantity: 40, unit: "g" },
      { name: "તેલ", quantity: 50, unit: "ml" },
    ],
  },
  {
    id: 4,
    name: "ગુલાબ જામુન",
    baseQuantity: 2,
    unit: "પીસ",
    materials: [
      { name: "ખોવા", quantity: 50, unit: "g" },
      { name: "ખાંડ", quantity: 30, unit: "g" },
      { name: "ઘી", quantity: 20, unit: "ml" },
    ],
  },
  {
    id: 5,
    name: "રોટલી",
    baseQuantity: 3,
    unit: "પીસ",
    materials: [
      { name: "લોટ", quantity: 75, unit: "g" },
      { name: "તેલ", quantity: 10, unit: "ml" },
      { name: "મીઠું", quantity: 2, unit: "g" },
    ],
  },
  {
    id: 6,
    name: "ચોખા",
    baseQuantity: 150,
    unit: "g",
    materials: [
      { name: "ચોખા", quantity: 60, unit: "g" },
      { name: "પાણી", quantity: 120, unit: "ml" },
      { name: "મીઠું", quantity: 2, unit: "g" },
    ],
  },
  {
    id: 7,
    name: "દાળ",
    baseQuantity: 100,
    unit: "ml",
    materials: [
      { name: "તુવેર દાળ", quantity: 30, unit: "g" },
      { name: "મસાલા", quantity: 5, unit: "g" },
      { name: "ઘી", quantity: 10, unit: "ml" },
    ],
  },
  {
    id: 8,
    name: "છાસ",
    baseQuantity: 200,
    unit: "ml",
    materials: [
      { name: "દહીં", quantity: 80, unit: "g" },
      { name: "પાણી", quantity: 120, unit: "ml" },
      { name: "મીઠું", quantity: 2, unit: "g" },
      { name: "જીરું", quantity: 1, unit: "g" },
    ],
  },
]

export default function OrderCalculation() {
  const [numberOfPeople, setNumberOfPeople] = useState("")
  const [selectedItems, setSelectedItems] = useState({})
  const [calculations, setCalculations] = useState(null)

  const handleItemToggle = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const calculateMaterials = () => {
    if (!numberOfPeople || numberOfPeople <= 0) {
      alert("કૃપા કરીને લોકોની સંખ્યા દાખલ કરો")
      return
    }

    const people = Number.parseInt(numberOfPeople)
    const selectedMenuItems = menuItems.filter((item) => selectedItems[item.id])

    if (selectedMenuItems.length === 0) {
      alert("કૃપા કરીને ઓછામાં ઓછી એક વાનગી પસંદ કરો")
      return
    }

    // Calculate total materials needed
    const totalMaterials = {}

    selectedMenuItems.forEach((item) => {
      item.materials.forEach((material) => {
        const totalQuantity = material.quantity * people

        if (totalMaterials[material.name]) {
          // Convert to same unit if needed and add
          totalMaterials[material.name].quantity += totalQuantity
        } else {
          totalMaterials[material.name] = {
            quantity: totalQuantity,
            unit: material.unit,
          }
        }
      })
    })

    setCalculations({
      people,
      selectedItems: selectedMenuItems,
      materials: totalMaterials,
    })
  }

  const formatQuantity = (quantity, unit) => {
    if (quantity >= 1000 && unit === "g") {
      return `${(quantity / 1000).toFixed(2)} કિલો`
    } else if (quantity >= 1000 && unit === "ml") {
      return `${(quantity / 1000).toFixed(2)} લિટર`
    }
    return `${quantity.toFixed(2)} ${unit}`
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            ઓર્ડર કેલ્ક્યુલેશન
          </CardTitle>
          <CardDescription>લોકોની સંખ્યા અને મેન્યુ આઇટમ્સ પસંદ કરો</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <Label htmlFor="people">લોકોની સંખ્યા:</Label>
            </div>
            <Input
              id="people"
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              placeholder="કુલ વ્યક્તિઓ"
              className="w-32"
              min="1"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">મેન્યુ આઇટમ્સ પસંદ કરો:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedItems[item.id] ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleItemToggle(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <input
                      type="checkbox"
                      checked={selectedItems[item.id] || false}
                      onChange={() => handleItemToggle(item.id)}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.baseQuantity} {item.unit} પ્રતિ વ્યક્તિ
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={calculateMaterials} className="bg-orange-600 hover:bg-orange-700">
            <Calculator className="w-4 h-4 mr-2" />
            ગણતરી કરો
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {calculations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              સામગ્રીની યાદી
            </CardTitle>
            <CardDescription>{calculations.people} લોકો માટે કુલ જરૂરી સામગ્રી</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selected Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3">પસંદ કરેલી વાનગીઓ:</h3>
              <div className="flex flex-wrap gap-2">
                {calculations.selectedItems.map((item) => (
                  <Badge key={item.id} variant="secondary" className="text-sm">
                    {item.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Materials List */}
            <div>
              <h3 className="text-lg font-semibold mb-3">જરૂરી સામગ્રી:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(calculations.materials).map(([materialName, details]) => (
                  <div key={materialName} className="p-4 border rounded-lg bg-gray-50">
                    <div className="font-medium text-gray-900">{materialName}</div>
                    <div className="text-lg font-bold text-orange-600">
                      {formatQuantity(details.quantity, details.unit)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">સારાંશ:</h3>
              <div className="text-sm text-orange-700">
                <p>
                  • કુલ લોકો: <strong>{calculations.people}</strong>
                </p>
                <p>
                  • કુલ વાનગીઓ: <strong>{calculations.selectedItems.length}</strong>
                </p>
                <p>
                  • કુલ સામગ્રી પ્રકાર: <strong>{Object.keys(calculations.materials).length}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
