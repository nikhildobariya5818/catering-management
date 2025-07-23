"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Printer, Edit, Save, Users } from "lucide-react"
import { format } from "date-fns"
import { useCategories } from "@/hooks/useCategories"

interface PrintableOrderProps {
  order: any
  onUpdateOrder: (orderId: string, updates: any) => void
}

export default function PrintableOrder({ order, onUpdateOrder }: PrintableOrderProps) {
  const { categories } = useCategories()
  const [isEditing, setIsEditing] = useState(false)
  const [editedPeople, setEditedPeople] = useState(order.numberOfPeople)

  const handlePrint = () => {
    window.print()
  }

  const handleUpdatePeople = async () => {
    const people = Number.parseInt(editedPeople)
    const selectedCategory = categories.find((cat) => cat.id === order.selectedCategory)

    if (!selectedCategory || !people || people <= 0) {
      alert("કૃપા કરીને યોગ્ય લોકોની સંખ્યા દાખલ કરો")
      return
    }

    // Recalculate vegetables with proper calculation
    const vegetableCalc = {}
    const manufacturingCalc = {}

    Object.entries(order.selectedItems).forEach(([itemId, isSelected]) => {
      if (isSelected) {
        const item = selectedCategory.items.find((i) => i.id === Number.parseInt(itemId))
        const varieties = order.itemVarieties[itemId] || 1

        if (item) {
          item.vegetables.forEach((vegetable) => {
            // Correct calculation: baseQuantity * people * varieties
            const totalQuantity = item.baseQuantity * people * varieties
            if (vegetableCalc[vegetable]) {
              vegetableCalc[vegetable] += totalQuantity
            } else {
              vegetableCalc[vegetable] = totalQuantity
            }
          })
        }
      }
    })

    // Manufacturing items calculation
    const manufacturingItems = [
      { name: "ચુલો", baseQuantity: 1, per: 50 },
      { name: "ગેસ બોટલ", baseQuantity: 1, per: 100 },
      { name: "થાળી", baseQuantity: 1, per: 1 },
      { name: "ગ્લાસ", baseQuantity: 1, per: 1 },
      { name: "ચમચી", baseQuantity: 1, per: 1 },
      { name: "કડાઈ", baseQuantity: 1, per: 25 },
      { name: "ટેબલ", baseQuantity: 1, per: 8 },
      { name: "ખુરશી", baseQuantity: 1, per: 1 },
    ]

    manufacturingItems.forEach((item) => {
      const quantity = Math.ceil(people / item.per) * item.baseQuantity
      manufacturingCalc[item.name] = quantity
    })

    const updatedData = {
      numberOfPeople: editedPeople,
      vegetableCalculations: vegetableCalc,
      manufacturingCalculations: manufacturingCalc,
    }

    try {
      await onUpdateOrder(order._id, updatedData)
      setIsEditing(false)
      alert("લોકોની સંખ્યા અને ગણતરી સફળતાપૂર્વક અપડેટ થઈ!")
    } catch (error) {
      alert("અપડેટ કરવામાં ભૂલ: " + error.message)
    }
  }

  const formatQuantity = (quantity, unit = "g") => {
    if (quantity >= 1000 && unit === "g") {
      return `${(quantity / 1000).toFixed(2)} કિલો`
    }
    return `${quantity.toFixed(0)} ${unit}`
  }

  const getSelectedItemsWithNames = () => {
    const selectedCategory = categories.find((cat) => cat.id === order.selectedCategory)
    if (!selectedCategory) return []

    const selectedItems = []
    Object.entries(order.selectedItems).forEach(([itemId, isSelected]) => {
      if (isSelected) {
        const item = selectedCategory.items.find((i) => i.id === Number.parseInt(itemId))
        const varieties = order.itemVarieties[itemId] || 1
        if (item) {
          selectedItems.push({
            name: item.name,
            varieties: varieties,
            baseQuantity: item.baseQuantity,
            vegetables: item.vegetables,
          })
        }
      }
    })
    return selectedItems
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "અજ્ઞાત કેટેગરી"
  }

  const selectedItemsWithNames = getSelectedItemsWithNames()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Print Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <Label>લોકોની સંખ્યા:</Label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={editedPeople}
                  onChange={(e) => setEditedPeople(e.target.value)}
                  className="w-20"
                  min="1"
                />
                <Button size="sm" onClick={handleUpdatePeople} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium">{order.numberOfPeople}</span>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Printer className="w-4 h-4 mr-2" />
          પ્રિન્ટ કરો
        </Button>
      </div>

      {/* Printable Content */}
      <div className="print:shadow-none space-y-4">
        {/* Header */}
        <Card className="print:shadow-none print:border-0">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl">કેટરિંગ ઓર્ડર વિગતો</CardTitle>
            <p className="text-sm text-gray-600">ઓર્ડર નંબર: #{order._id?.slice(-6) || order.id}</p>
          </CardHeader>
        </Card>

        {/* Client Information */}
        <Card className="print:shadow-none print:border-0">
          <CardHeader>
            <CardTitle>ગ્રાહક માહિતી</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>નામ:</strong> {order.clientName}
              </div>
              <div>
                <strong>ફોન:</strong> {order.phone}
              </div>
              <div className="sm:col-span-2">
                <strong>સરનામું:</strong> {order.address}
              </div>
              <div>
                <strong>કાર્યક્રમની તારીખ:</strong>{" "}
                {order.eventDate ? format(new Date(order.eventDate), "dd/MM/yyyy") : ""}
              </div>
              <div>
                <strong>સમય:</strong> {order.eventTime}
              </div>
              <div>
                <strong>લોકોની સંખ્યા:</strong> {order.numberOfPeople}
              </div>
              <div>
                <strong>કાર્યક્રમનો પ્રકાર:</strong> {order.eventType || "નથી આપ્યું"}
              </div>
              <div className="sm:col-span-2">
                <strong>કેટેગરી:</strong> {getCategoryName(order.selectedCategory)}
              </div>
            </div>
            {order.specialRequests && (
              <div className="mt-4">
                <strong>વિશેષ આવશ્યકતાઓ:</strong>
                <p className="text-sm text-gray-600 mt-1">{order.specialRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Items with Proper Names */}
        <Card className="print:shadow-none print:border-0">
          <CardHeader>
            <CardTitle>પસંદ કરેલી આઇટમ્સ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedItemsWithNames.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <div className="font-medium text-lg">{item.name}</div>
                    <div className="text-sm text-gray-600 mt-1">સામગ્રી: {item.vegetables.join(", ")}</div>
                    <div className="text-sm text-blue-600 mt-1">બેઝ ક્વોન્ટિટી: {item.baseQuantity}g પ્રતિ વ્યક્તિ</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">{item.varieties} વેરાયટી</div>
                    <div className="text-sm text-gray-500">
                      કુલ: {item.baseQuantity * Number.parseInt(order.numberOfPeople) * item.varieties}g
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vegetable Requirements with Correct Calculation */}
        {order.vegetableCalculations && Object.keys(order.vegetableCalculations).length > 0 && (
          <Card className="print:shadow-none print:border-0">
            <CardHeader>
              <CardTitle>શાકભાજીની જરૂરિયાત</CardTitle>
              <p className="text-sm text-gray-600">{order.numberOfPeople} લોકો માટે કુલ જરૂરી શાકભાજી</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(order.vegetableCalculations).map(([vegetable, quantity]) => (
                  <div key={vegetable} className="p-4 border rounded-lg bg-green-50">
                    <div className="font-medium text-gray-900">{vegetable}</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">{formatQuantity(quantity)}</div>
                    <div className="text-xs text-gray-500 mt-1">({quantity}g કુલ)</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manufacturing Items */}
        {order.manufacturingCalculations && Object.keys(order.manufacturingCalculations).length > 0 && (
          <Card className="print:shadow-none print:border-0">
            <CardHeader>
              <CardTitle>મેન્યુફેક્ચરિંગ આઇટમ્સ</CardTitle>
              <p className="text-sm text-gray-600">{order.numberOfPeople} લોકો માટે જરૂરી સાધનો</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(order.manufacturingCalculations).map(([item, quantity]) => (
                  <div key={item} className="p-4 border rounded-lg bg-blue-50">
                    <div className="font-medium text-gray-900">{item}</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">{quantity} પીસ</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Calculation Breakdown */}
        <Card className="print:shadow-none print:border-0">
          <CardHeader>
            <CardTitle>ગણતરીની વિગતો</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedItemsWithNames.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg bg-yellow-50">
                  <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>બેઝ ક્વોન્ટિટી:</strong> {item.baseQuantity}g પ્રતિ વ્યક્તિ
                      </p>
                      <p>
                        <strong>લોકોની સંખ્યા:</strong> {order.numberOfPeople}
                      </p>
                      <p>
                        <strong>વેરાયટી:</strong> {item.varieties}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>ગણતરી:</strong> {item.baseQuantity} × {order.numberOfPeople} × {item.varieties}
                      </p>
                      <p>
                        <strong>કુલ:</strong>{" "}
                        {item.baseQuantity * Number.parseInt(order.numberOfPeople) * item.varieties}g
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm">
                      <strong>જરૂરી શાકભાજી:</strong>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.vegetables.map((veg, vegIndex) => (
                        <span key={vegIndex} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {veg}:{" "}
                          {formatQuantity(item.baseQuantity * Number.parseInt(order.numberOfPeople) * item.varieties)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="print:shadow-none print:border-0">
          <CardHeader>
            <CardTitle>ઓર્ડર સારાંશ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-sm space-y-2">
                <p>
                  • ઓર્ડર તારીખ: <strong>{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</strong>
                </p>
                <p>
                  • ગ્રાહક: <strong>{order.clientName}</strong>
                </p>
                <p>
                  • કુલ લોકો: <strong>{order.numberOfPeople}</strong>
                </p>
                <p>
                  • કેટેગરી: <strong>{getCategoryName(order.selectedCategory)}</strong>
                </p>
                <p>
                  • પસંદ કરેલી આઇટમ્સ: <strong>{selectedItemsWithNames.length}</strong>
                </p>
                <p>
                  • કુલ શાકભાજી પ્રકાર: <strong>{Object.keys(order.vegetableCalculations || {}).length}</strong>
                </p>
                <p>
                  • કુલ મેન્યુફેક્ચરિંગ આઇટમ્સ: <strong>{Object.keys(order.manufacturingCalculations || {}).length}</strong>
                </p>
                <p>
                  • સ્ટેટસ: <strong>{order.status}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8 print:mt-4 border-t pt-4">
          <p className="font-semibold">ગુજરાતી કેટરિંગ સર્વિસ</p>
          <p>આ ઓર્ડર કેટરિંગ મેનેજમેન્ટ સિસ્ટમ દ્વારા જનરેટ કરવામાં આવ્યો છે</p>
          <p>પ્રિન્ટ તારીખ: {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
        </div>
      </div>
    </div>
  )
}
