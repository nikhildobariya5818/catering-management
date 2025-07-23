"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Users, MapPin, Phone, User } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ClientFormProps {
  onAddOrder: (order: any) => void
}

export default function ClientForm({ onAddOrder }: ClientFormProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    address: "",
    eventDate: null,
    eventTime: "",
    numberOfPeople: "",
    eventType: "",
    specialRequests: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddOrder({
      ...formData,
      createdAt: new Date(),
      status: "નવો",
    })

    // Reset form
    setFormData({
      clientName: "",
      phone: "",
      address: "",
      eventDate: null,
      eventTime: "",
      numberOfPeople: "",
      eventType: "",
      specialRequests: "",
    })

    alert("ઓર્ડર સફળતાપૂર્વક ઉમેરાયો!")
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <User className="w-6 h-6" />
          ગ્રાહક માહિતી
        </CardTitle>
        <CardDescription>નવા કેટરિંગ ઓર્ડર માટે વિગતો ભરો</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">ગ્રાહક વિગતો</h3>

              <div className="space-y-2">
                <Label htmlFor="clientName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  ગ્રાહકનું નામ *
                </Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="ગ્રાહકનું પૂરું નામ દાખલ કરો"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  ફોન નંબર *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="મોબાઇલ નંબર"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  સરનામું *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="સંપૂર્ણ સરનામું"
                  required
                />
              </div>
            </div>

            {/* Event Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">કાર્યક્રમ વિગતો</h3>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  કાર્યક્રમની તારીખ *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.eventDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.eventDate ? format(formData.eventDate, "dd/MM/yyyy") : "તારીખ પસંદ કરો"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.eventDate}
                      onSelect={(date) => handleInputChange("eventDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  સમય *
                </Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => handleInputChange("eventTime", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfPeople" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  લોકોની સંખ્યા *
                </Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  value={formData.numberOfPeople}
                  onChange={(e) => handleInputChange("numberOfPeople", e.target.value)}
                  placeholder="કુલ વ્યક્તિઓ"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">કાર્યક્રમનો પ્રકાર</Label>
                <Input
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange("eventType", e.target.value)}
                  placeholder="લગ્ન, જન્મદિવસ, કોર્પોરેટ ઇવેન્ટ વગેરે"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">વિશેષ આવશ્યકતાઓ</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
              placeholder="કોઈ વિશેષ આવશ્યકતાઓ અથવા નોંધો"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
            ઓર્ડર સેવ કરો
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
