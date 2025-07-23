"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Users, Phone, MapPin, Eye, Edit, Trash2, Printer, Search, Filter } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Order {
  _id: string
  clientName: string
  phone: string
  address: string
  eventDate: Date
  eventTime: string
  numberOfPeople: string
  eventType: string
  specialRequests: string
  status: string
  createdAt: Date
  selectedCategory: number
  selectedItems: any
  itemVarieties: any
  vegetableCalculations: any
  manufacturingCalculations: any
}

interface OrdersListProps {
  orders: Order[]
  onUpdateOrder: (orderId: string, updates: any) => void
  onSelectOrder: (order: Order) => void
  onDeleteOrder: (orderId: string) => void
}

export default function OrdersList({ orders, onUpdateOrder, onSelectOrder, onDeleteOrder }: OrdersListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "નવો":
        return "bg-blue-100 text-blue-800"
      case "કન્ફર્મ":
        return "bg-green-100 text-green-800"
      case "પ્રોગ્રેસમાં":
        return "bg-yellow-100 text-yellow-800"
      case "પૂર્ણ":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryName = (categoryId: number) => {
    const categories = {
      1: "માત્ર ભજિયા",
      2: "ભજિયા સાથે ચાટ",
      3: "ભજિયા વિના ચાટ",
    }
    return categories[categoryId] || "અજ્ઞાત"
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await onUpdateOrder(orderId, { status: newStatus })
    } catch (error) {
      alert("સ્ટેટસ અપડેટ કરવામાં ભૂલ: " + error.message)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await onDeleteOrder(orderId)
    } catch (error) {
      alert("ઓર્ડર ડિલીટ કરવામાં ભૂલ: " + error.message)
    }
  }

  // Filter orders based on search term, date, and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = selectedDate
      ? format(new Date(order.eventDate), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      : true

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesDate && matchesStatus
  })

  if (orders.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-gray-500 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">કોઈ ઓર્ડર નથી</h3>
            <p className="text-sm">નવો ઓર્ડર ઉમેરવા માટે "નવો ઓર્ડર" ટેબ પર જાઓ</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold">કુલ ઓર્ડર્સ ({filteredOrders.length})</h2>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="sm:hidden">
            <Filter className="w-4 h-4 mr-2" />
            ફિલ્ટર
          </Button>
        </div>

        {/* Search and Filters */}
        <div className={`space-y-4 ${showFilters ? "block" : "hidden sm:block"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="નામ, ફોન અથવા સરનામું શોધો..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Filter */}
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "તારીખ પસંદ કરો"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">બધા સ્ટેટસ</option>
                <option value="નવો">નવો</option>
                <option value="કન્ફર્મ">કન્ફર્મ</option>
                <option value="પ્રોગ્રેસમાં">પ્રોગ્રેસમાં</option>
                <option value="પૂર્ણ">પૂર્ણ</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedDate(new Date())
                  setStatusFilter("all")
                }}
                className="flex-1"
              >
                ક્લિયર
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())} className="flex-1">
                આજે
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{order.clientName}</span>
                  </CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {order.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {order.numberOfPeople} લોકો
                    </span>
                  </CardDescription>
                </div>
                <div className="flex flex-row sm:flex-col gap-2">
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="text-xs p-1 border rounded min-w-0"
                  >
                    <option value="નવો">નવો</option>
                    <option value="કન્ફર્મ">કન્ફર્મ</option>
                    <option value="પ્રોગ્રેસમાં">પ્રોગ્રેસમાં</option>
                    <option value="પૂર્ણ">પૂર્ણ</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <span>કાર્યક્રમની તારીખ: </span>
                    <strong>{order.eventDate ? format(new Date(order.eventDate), "dd/MM/yyyy") : "N/A"}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <span>સમય: </span>
                    <strong>{order.eventTime}</strong>
                  </div>
                  <div className="text-sm">
                    <span>કેટેગરી: </span>
                    <strong className="text-xs sm:text-sm">{getCategoryName(order.selectedCategory)}</strong>
                  </div>
                  {order.eventType && (
                    <div className="text-sm">
                      <span>કાર્યક્રમનો પ્રકાર: </span>
                      <strong className="text-xs sm:text-sm">{order.eventType}</strong>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <span>સરનામું: </span>
                      <div className="text-gray-600 text-xs sm:text-sm break-words">{order.address}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span>પસંદ કરેલી આઇટમ્સ: </span>
                    <strong>{Object.values(order.selectedItems || {}).filter(Boolean).length}</strong>
                  </div>
                  <div className="text-sm">
                    <span>શાકભાજી પ્રકાર: </span>
                    <strong>{Object.keys(order.vegetableCalculations || {}).length}</strong>
                  </div>
                </div>
              </div>

              {order.specialRequests && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">વિશેષ આવશ્યકતાઓ: </span>
                  <p className="text-sm text-gray-600 mt-1 break-words">{order.specialRequests}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t">
                <div className="text-xs text-gray-500">
                  બનાવ્યું: {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onSelectOrder(order)
                      // Switch to print tab after selecting order
                      window.dispatchEvent(new CustomEvent("switchTab", { detail: "print" }))
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">જુઓ</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onSelectOrder(order)
                      window.dispatchEvent(new CustomEvent("switchTab", { detail: "print" }))
                    }}
                  >
                    <Printer className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">પ્રિન્ટ</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">એડિટ</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOrder(order._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">ડિલીટ</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && orders.length > 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">કોઈ ઓર્ડર મળ્યો નથી</h3>
              <p className="text-sm">અલગ ફિલ્ટર અજમાવો અથવા શોધ શબ્દ બદલો</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
