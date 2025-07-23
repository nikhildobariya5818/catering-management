"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/useCategories"

const manufacturingItems = [
  { name: "ચુલો", baseQuantity: 1, per: 50 }, // 1 chulo per 50 people
  { name: "ગેસ બોટલ", baseQuantity: 1, per: 100 }, // 1 gas bottle per 100 people
  { name: "થાળી", baseQuantity: 1, per: 1 }, // 1 plate per person
  { name: "ગ્લાસ", baseQuantity: 1, per: 1 }, // 1 glass per person
  { name: "ચમચી", baseQuantity: 1, per: 1 }, // 1 spoon per person
  { name: "કડાઈ", baseQuantity: 1, per: 25 }, // 1 kadai per 25 people
  { name: "ટેબલ", baseQuantity: 1, per: 8 }, // 1 table per 8 people
  { name: "ખુરશી", baseQuantity: 1, per: 1 }, // 1 chair per person
]

interface OrderFlowProps {
  onAddOrder: (order: any) => void
}

export default function OrderFlow({ onAddOrder }: OrderFlowProps) {
  const { categories, loading: categoriesLoading } = useCategories()
  const [step, setStep] = useState(1)
  const [orderData, setOrderData] = useState({
    // Step 1: Client Details
    clientName: "",
    phone: "",
    address: "",
    eventDate: null,
    eventTime: "",
    numberOfPeople: "",
    eventType: "",
    specialRequests: "",

    // Step 2: Category Selection
    selectedCategory: null,

    // Step 3: Item Selection
    selectedItems: {},
    itemVarieties: {}, // How many varieties of each item

    // Step 4: Calculations
    vegetableCalculations: {},
    manufacturingCalculations: {},
  })

  useEffect(() => {
    // Auto-recalculate when numberOfPeople changes and we have calculations
    if (orderData.numberOfPeople && Object.keys(orderData.vegetableCalculations).length > 0) {
      calculateRequirements()
    }
  }, [orderData.numberOfPeople, orderData.selectedItems, orderData.itemVarieties])

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    onAddOrder(orderData)
    // Reset form
    setOrderData({
      clientName: "",
      phone: "",
      address: "",
      eventDate: null,
      eventTime: "",
      numberOfPeople: "",
      eventType: "",
      specialRequests: "",
      selectedCategory: null,
      selectedItems: {},
      itemVarieties: {},
      vegetableCalculations: {},
      manufacturingCalculations: {},
    })
    setStep(1)
    alert("ઓર્ડર સફળતાપૂર્વક ઉમેરાયો!")
  }

  const calculateRequirements = () => {
    const people = Number.parseInt(orderData.numberOfPeople)
    const selectedCategory = categories.find((cat) => cat.id === orderData.selectedCategory)

    if (!selectedCategory || !people || people <= 0) {
      alert("કૃપા કરીને યોગ્ય લોકોની સંખ્યા દાખલ કરો")
      return
    }

    // Calculate vegetables
    const vegetableCalc = {}
    const manufacturingCalc = {}

    Object.entries(orderData.selectedItems).forEach(([itemId, isSelected]) => {
      if (isSelected) {
        const item = selectedCategory.items.find((i) => i.id === Number.parseInt(itemId))
        const varieties = orderData.itemVarieties[itemId] || 1

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

    // Calculate manufacturing items
    manufacturingItems.forEach((item) => {
      const quantity = Math.ceil(people / item.per) * item.baseQuantity
      manufacturingCalc[item.name] = quantity
    })

    setOrderData((prev) => ({
      ...prev,
      vegetableCalculations: vegetableCalc,
      manufacturingCalculations: manufacturingCalc,
    }))
  }

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>પગલું 1: ગ્રાહક અને કાર્યક્રમની વિગતો</CardTitle>
        <CardDescription>કાર્યક્રમની તારીખ અને ગ્રાહકની માહિતી દાખલ કરો</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">ગ્રાહકનું નામ *</Label>
              <Input
                id="clientName"
                value={orderData.clientName}
                onChange={(e) => setOrderData((prev) => ({ ...prev, clientName: e.target.value }))}
                placeholder="ગ્રાહકનું પૂરું નામ"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">ફોન નંબર *</Label>
              <Input
                id="phone"
                value={orderData.phone}
                onChange={(e) => setOrderData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="મોબાઇલ નંબર"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">સરનામું *</Label>
              <Textarea
                id="address"
                value={orderData.address}
                onChange={(e) => setOrderData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="સંપૂર્ણ સરનામું"
                required
                rows={2}
              />
            </div>
            <div>
              <Label>કાર્યક્રમની તારીખ *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !orderData.eventDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {orderData.eventDate ? format(orderData.eventDate, "dd/MM/yyyy") : "તારીખ પસંદ કરો"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={orderData.eventDate}
                    onSelect={(date) => setOrderData((prev) => ({ ...prev, eventDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventTime">સમય *</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={orderData.eventTime}
                  onChange={(e) => setOrderData((prev) => ({ ...prev, eventTime: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="numberOfPeople">લોકોની સંખ્યા *</Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  value={orderData.numberOfPeople}
                  onChange={(e) => {
                    setOrderData((prev) => ({ ...prev, numberOfPeople: e.target.value }))
                    // If we're on step 4 and have calculations, recalculate immediately
                    if (step === 4 && Object.keys(orderData.vegetableCalculations).length > 0) {
                      setTimeout(() => calculateRequirements(), 100)
                    }
                  }}
                  placeholder="કુલ વ્યક્તિઓ"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="eventType">કાર્યક્રમનો પ્રકાર</Label>
              <Input
                id="eventType"
                value={orderData.eventType}
                onChange={(e) => setOrderData((prev) => ({ ...prev, eventType: e.target.value }))}
                placeholder="લગ્ન, જન્મદિવસ, કોર્પોરેટ ઇવેન્ટ વગેરે"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="specialRequests">વિશેષ આવશ્યકતાઓ</Label>
          <Textarea
            id="specialRequests"
            value={orderData.specialRequests}
            onChange={(e) => setOrderData((prev) => ({ ...prev, specialRequests: e.target.value }))}
            placeholder="કોઈ વિશેષ આવશ્યકતાઓ અથવા નોંધો"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>પગલું 2: કેટેગરી પસંદ કરો</CardTitle>
        <CardDescription>તમારા કાર્યક્રમ માટે યોગ્ય કેટેગરી પસંદ કરો</CardDescription>
      </CardHeader>
      <CardContent>
        {categoriesLoading ? (
          <div className="text-center py-8">કેટેગરી લોડ થઈ રહી છે...</div>
        ) : (
          <div className="grid gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  orderData.selectedCategory === category.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setOrderData((prev) => ({ ...prev, selectedCategory: category.id }))}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    <div className="mt-2">
                      <Badge variant="secondary">{category.items.length} આઇટમ્સ</Badge>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={orderData.selectedCategory === category.id}
                    onChange={() => setOrderData((prev) => ({ ...prev, selectedCategory: category.id }))}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderStep3 = () => {
    const selectedCategory = categories.find((cat) => cat.id === orderData.selectedCategory)
    if (!selectedCategory) return null

    const bhajiyas = selectedCategory.items.filter((item) => !item.type || item.type === "bhajiya")
    const chaats = selectedCategory.items.filter((item) => item.type === "chaat")

    return (
      <Card>
        <CardHeader>
          <CardTitle>પગલું 3: આઇટમ્સ અને વેરાયટી પસંદ કરો</CardTitle>
          <CardDescription>{selectedCategory.name} માટે આઇટમ્સ પસંદ કરો</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {bhajiyas.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">ભજિયા વેરાયટી</h3>
              <div className="grid gap-3">
                {bhajiyas.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={orderData.selectedItems[item.id] || false}
                        onChange={(e) =>
                          setOrderData((prev) => ({
                            ...prev,
                            selectedItems: { ...prev.selectedItems, [item.id]: e.target.checked },
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-sm text-gray-600">સામગ્રી: {item.vegetables.join(", ")}</div>
                      </div>
                    </div>
                    {orderData.selectedItems[item.id] && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`variety-${item.id}`} className="text-sm">
                          વેરાયટી:
                        </Label>
                        <Input
                          id={`variety-${item.id}`}
                          type="number"
                          min="1"
                          max="5"
                          value={orderData.itemVarieties[item.id] || 1}
                          onChange={(e) =>
                            setOrderData((prev) => ({
                              ...prev,
                              itemVarieties: { ...prev.itemVarieties, [item.id]: Number.parseInt(e.target.value) },
                            }))
                          }
                          className="w-16"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {chaats.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">ચાટ વેરાયટી</h3>
              <div className="grid gap-3">
                {chaats.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={orderData.selectedItems[item.id] || false}
                        onChange={(e) =>
                          setOrderData((prev) => ({
                            ...prev,
                            selectedItems: { ...prev.selectedItems, [item.id]: e.target.checked },
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-sm text-gray-600">સામગ્રી: {item.vegetables.join(", ")}</div>
                      </div>
                    </div>
                    {orderData.selectedItems[item.id] && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`variety-${item.id}`} className="text-sm">
                          વેરાયટી:
                        </Label>
                        <Input
                          id={`variety-${item.id}`}
                          type="number"
                          min="1"
                          max="5"
                          value={orderData.itemVarieties[item.id] || 1}
                          onChange={(e) =>
                            setOrderData((prev) => ({
                              ...prev,
                              itemVarieties: { ...prev.itemVarieties, [item.id]: Number.parseInt(e.target.value) },
                            }))
                          }
                          className="w-16"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderStep4 = () => {
    const formatQuantity = (quantity, unit = "g") => {
      if (quantity >= 1000 && unit === "g") {
        return `${(quantity / 1000).toFixed(2)} કિલો`
      }
      return `${quantity.toFixed(0)} ${unit}`
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>પગલું 4: ઓર્ડર કેલ્ક્યુલેશન</CardTitle>
          <CardDescription>શાકભાજી અને મેન્યુફેક્ચરિંગ આઇટમ્સની ગણતરી</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button onClick={calculateRequirements} className="bg-blue-600 hover:bg-blue-700">
              ગણતરી કરો
            </Button>
          </div>

          {Object.keys(orderData.vegetableCalculations).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">શાકભાજીની જરૂરિયાત</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(orderData.vegetableCalculations).map(([vegetable, quantity]) => (
                  <div key={vegetable} className="p-3 border rounded-lg bg-green-50">
                    <div className="font-medium">{vegetable}</div>
                    <div className="text-lg font-bold text-green-600">{formatQuantity(quantity)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(orderData.manufacturingCalculations).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">મેન્યુફેક્ચરિંગ આઇટમ્સ</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(orderData.manufacturingCalculations).map(([item, quantity]) => (
                  <div key={item} className="p-3 border rounded-lg bg-blue-50">
                    <div className="font-medium">{item}</div>
                    <div className="text-lg font-bold text-blue-600">{quantity} પીસ</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">ઓર્ડર સારાંશ:</h3>
            <div className="text-sm text-orange-700 space-y-1">
              <p>
                • ગ્રાહક: <strong>{orderData.clientName}</strong>
              </p>
              <p>
                • કુલ લોકો: <strong>{orderData.numberOfPeople}</strong>
              </p>
              <p>
                • કાર્યક્રમની તારીખ:{" "}
                <strong>{orderData.eventDate ? format(orderData.eventDate, "dd/MM/yyyy") : ""}</strong>
              </p>
              <p>
                • કેટેગરી: <strong>{categories.find((cat) => cat.id === orderData.selectedCategory)?.name}</strong>
              </p>
              <p>
                • પસંદ કરેલી આઇટમ્સ: <strong>{Object.values(orderData.selectedItems).filter(Boolean).length}</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return (
          orderData.clientName &&
          orderData.phone &&
          orderData.address &&
          orderData.eventDate &&
          orderData.eventTime &&
          orderData.numberOfPeople
        )
      case 2:
        return orderData.selectedCategory
      case 3:
        return Object.values(orderData.selectedItems).some(Boolean)
      case 4:
        return Object.keys(orderData.vegetableCalculations).length > 0
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-orange-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
          className="flex items-center justify-center gap-2 order-2 sm:order-1 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          પાછળ
        </Button>

        {step < 4 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 order-1 sm:order-2"
          >
            આગળ
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 order-1 sm:order-2"
          >
            <CheckCircle className="w-4 h-4" />
            ઓર્ડર સેવ કરો
          </Button>
        )}
      </div>
    </div>
  )
}
