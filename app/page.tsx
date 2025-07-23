"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ChefHat, Settings, FileText, Calculator, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import OrderFlow from "@/components/order-flow"
import CategoryManagement from "@/components/category-management"
import OrdersList from "@/components/orders-list"
import PrintableOrder from "@/components/printable-order"
import SettingsPage from "@/components/settings-page"
import { useOrders } from "@/hooks/useOrders"

export default function AdvancedCateringSystem() {
  const [activeTab, setActiveTab] = useState("new-order")
  const [currentOrder, setCurrentOrder] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { orders, loading, createOrder, updateOrder, deleteOrder } = useOrders()

  useEffect(() => {
    const handleTabSwitch = (event) => {
      setActiveTab(event.detail)
    }

    window.addEventListener("switchTab", handleTabSwitch)
    return () => window.removeEventListener("switchTab", handleTabSwitch)
  }, [])

  const handleAddOrder = async (orderData) => {
    try {
      const newOrder = await createOrder(orderData)
      setCurrentOrder(newOrder)
      setActiveTab("print")
      setIsMobileMenuOpen(false)
    } catch (error) {
      alert("ઓર્ડર બનાવવામાં ભૂલ: " + error.message)
    }
  }

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      const updatedOrder = await updateOrder(orderId, updates)
      setCurrentOrder(updatedOrder)
    } catch (error) {
      alert("ઓર્ડર અપડેટ કરવામાં ભૂલ: " + error.message)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (confirm("શું તમે ખરેખર આ ઓર્ડર ડિલીટ કરવા માંગો છો?")) {
      try {
        await deleteOrder(orderId)
        if (currentOrder && currentOrder._id === orderId) {
          setCurrentOrder(null)
        }
      } catch (error) {
        alert("ઓર્ડર ડિલીટ કરવામાં ભૂલ: " + error.message)
      }
    }
  }

  const seedDatabase = async () => {
    try {
      const response = await fetch("/api/seed", { method: "POST" })
      const result = await response.json()
      if (result.success) {
        alert("ડેટાબેઝ સફળતાપૂર્વક સીડ થયો!")
        window.location.reload()
      }
    } catch (error) {
      alert("ડેટાબેઝ સીડ કરવામાં ભૂલ: " + error.message)
    }
  }

  const TabButton = ({ value, icon: Icon, children, disabled = false }) => (
    <TabsTrigger
      value={value}
      disabled={disabled}
      className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4 py-2"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon className="w-3 h-3 md:w-4 md:h-4" />
      <span className="hidden sm:inline">{children}</span>
    </TabsTrigger>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">કેટરિંગ સિસ્ટમ</h1>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">મેન્યુ</h2>
                  <div className="space-y-2">
                    <Button
                      variant={activeTab === "new-order" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab("new-order")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      નવો ઓર્ડર
                    </Button>
                    <Button
                      variant={activeTab === "orders" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab("orders")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      ઓર્ડર્સ ({orders.length})
                    </Button>
                    <Button
                      variant={activeTab === "categories" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab("categories")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <ChefHat className="w-4 h-4 mr-2" />
                      કેટેગરી મેનેજમેન્ટ
                    </Button>
                    <Button
                      variant={activeTab === "print" ? "default" : "ghost"}
                      className="w-full justify-start"
                      disabled={!currentOrder}
                      onClick={() => {
                        setActiveTab("print")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      પ્રિન્ટ ઓર્ડર
                    </Button>
                    <Button
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab("settings")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      સેટિંગ્સ
                    </Button>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <Button onClick={seedDatabase} className="w-full bg-purple-600 hover:bg-purple-700">
                      ડેટાબેઝ સીડ કરો
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Header */}
        

        <div className="px-2 md:px-4 pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop Tabs */}
            <TabsList className="hidden md:grid w-full grid-cols-5 mb-8 max-w-4xl mx-auto">
              <TabButton value="new-order" icon={Calendar}>
                નવો ઓર્ડર
              </TabButton>
              <TabButton value="orders" icon={FileText}>
                ઓર્ડર્સ ({orders.length})
              </TabButton>
              <TabButton value="categories" icon={ChefHat}>
                કેટેગરી મેનેજમેન્ટ
              </TabButton>
              <TabButton value="print" icon={Calculator} disabled={!currentOrder}>
                પ્રિન્ટ ઓર્ડર
              </TabButton>
              <TabButton value="settings" icon={Settings}>
                સેટિંગ્સ
              </TabButton>
            </TabsList>

            {/* Mobile Tabs */}
            <TabsList className="md:hidden grid w-full grid-cols-5 mb-4 h-12">
              <TabButton value="new-order" icon={Calendar}>
                નવો
              </TabButton>
              <TabButton value="orders" icon={FileText}>
                ઓર્ડર
              </TabButton>
              <TabButton value="categories" icon={ChefHat}>
                કેટેગરી
              </TabButton>
              <TabButton value="print" icon={Calculator} disabled={!currentOrder}>
                પ્રિન્ટ
              </TabButton>
              <TabButton value="settings" icon={Settings}>
                સેટિંગ
              </TabButton>
            </TabsList>

            <TabsContent value="new-order" className="mt-0">
              <OrderFlow onAddOrder={handleAddOrder} />
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              {loading ? (
                <div className="text-center py-12">લોડ થઈ રહ્યું છે...</div>
              ) : (
                <OrdersList
                  orders={orders}
                  onUpdateOrder={handleUpdateOrder}
                  onSelectOrder={setCurrentOrder}
                  onDeleteOrder={handleDeleteOrder}
                />
              )}
            </TabsContent>

            <TabsContent value="categories" className="mt-0">
              <CategoryManagement />
            </TabsContent>

            <TabsContent value="print" className="mt-0">
              {currentOrder && <PrintableOrder order={currentOrder} onUpdateOrder={handleUpdateOrder} />}
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SettingsPage />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
