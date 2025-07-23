"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Building, Printer, Bell, Database, Download, Upload, Trash2, Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [businessSettings, setBusinessSettings] = useState({
    businessName: "ગુજરાતી કેટરિંગ સર્વિસ",
    ownerName: "માલિકનું નામ",
    phone: "+91 98765 43210",
    email: "info@gujaraticatering.com",
    address: "123, મુખ્ય બજાર, અમદાવાદ, ગુજરાત - 380001",
    gstNumber: "24XXXXX1234X1ZX",
    logo: "",
  })

  const [printSettings, setPrintSettings] = useState({
    showLogo: true,
    showGST: true,
    showAddress: true,
    showPhone: true,
    printFormat: "A4",
    fontSize: "medium",
    includeCalculations: true,
    includeNotes: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    statusUpdates: true,
    dailyReport: false,
    lowStock: true,
    emailNotifications: false,
    smsNotifications: false,
  })

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "1year",
    defaultOrderStatus: "નવો",
    defaultPeople: "50",
    currency: "₹",
  })

  const handleBusinessSettingsChange = (field, value) => {
    setBusinessSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handlePrintSettingsChange = (field, value) => {
    setPrintSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationSettingsChange = (field, value) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSystemSettingsChange = (field, value) => {
    setSystemSettings((prev) => ({ ...prev, [field]: value }))
  }

  const saveSettings = async () => {
    try {
      // Here you would save settings to your backend
      const settings = {
        business: businessSettings,
        print: printSettings,
        notifications: notificationSettings,
        system: systemSettings,
      }

      localStorage.setItem("cateringSettings", JSON.stringify(settings))
      alert("સેટિંગ્સ સફળતાપૂર્વક સેવ થઈ!")
    } catch (error) {
      alert("સેટિંગ્સ સેવ કરવામાં ભૂલ: " + error.message)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch("/api/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `catering-data-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert("ડેટા એક્સપોર્ટ કરવામાં ભૂલ: " + error.message)
    }
  }

  const clearAllData = async () => {
    if (confirm("શું તમે ખરેખર બધો ડેટા ડિલીટ કરવા માંગો છો? આ ક્રિયા પાછી કરી શકાશે નહીં!")) {
      if (confirm("છેલ્લી વાર પુષ્ટિ કરો - બધો ડેટા ડિલીટ થઈ જશે!")) {
        try {
          await fetch("/api/clear-all", { method: "DELETE" })
          alert("બધો ડેટા સફળતાપૂર્વક ડિલીટ થયો!")
          window.location.reload()
        } catch (error) {
          alert("ડેટા ડિલીટ કરવામાં ભૂલ: " + error.message)
        }
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          સિસ્ટમ સેટિંગ્સ
        </h2>
        <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          સેવ કરો
        </Button>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="business" className="text-xs md:text-sm">
            <Building className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">બિઝનેસ</span>
          </TabsTrigger>
          <TabsTrigger value="print" className="text-xs md:text-sm">
            <Printer className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">પ્રિન્ટ</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs md:text-sm">
            <Bell className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">નોટિફિકેશન</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="text-xs md:text-sm">
            <Database className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">સિસ્ટમ</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                બિઝનેસ માહિતી
              </CardTitle>
              <CardDescription>તમારી કેટરિંગ બિઝનેસની વિગતો</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">બિઝનેસનું નામ</Label>
                  <Input
                    id="businessName"
                    value={businessSettings.businessName}
                    onChange={(e) => handleBusinessSettingsChange("businessName", e.target.value)}
                    placeholder="તમારી કેટરિંગ સર્વિસનું નામ"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">માલિકનું નામ</Label>
                  <Input
                    id="ownerName"
                    value={businessSettings.ownerName}
                    onChange={(e) => handleBusinessSettingsChange("ownerName", e.target.value)}
                    placeholder="માલિકનું પૂરું નામ"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">ફોન નંબર</Label>
                  <Input
                    id="phone"
                    value={businessSettings.phone}
                    onChange={(e) => handleBusinessSettingsChange("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="email">ઈમેઈલ</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) => handleBusinessSettingsChange("email", e.target.value)}
                    placeholder="info@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">સરનામું</Label>
                  <Textarea
                    id="address"
                    value={businessSettings.address}
                    onChange={(e) => handleBusinessSettingsChange("address", e.target.value)}
                    placeholder="સંપૂર્ણ બિઝનેસ સરનામું"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="gstNumber">GST નંબર</Label>
                  <Input
                    id="gstNumber"
                    value={businessSettings.gstNumber}
                    onChange={(e) => handleBusinessSettingsChange("gstNumber", e.target.value)}
                    placeholder="24XXXXX1234X1ZX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="print" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5" />
                પ્રિન્ટ સેટિંગ્સ
              </CardTitle>
              <CardDescription>ઓર્ડર પ્રિન્ટ કરવા માટેની સેટિંગ્સ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">પ્રિન્ટમાં શામેલ કરો</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showLogo">કંપની લોગો</Label>
                      <Switch
                        id="showLogo"
                        checked={printSettings.showLogo}
                        onCheckedChange={(checked) => handlePrintSettingsChange("showLogo", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showGST">GST નંબર</Label>
                      <Switch
                        id="showGST"
                        checked={printSettings.showGST}
                        onCheckedChange={(checked) => handlePrintSettingsChange("showGST", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showAddress">સરનામું</Label>
                      <Switch
                        id="showAddress"
                        checked={printSettings.showAddress}
                        onCheckedChange={(checked) => handlePrintSettingsChange("showAddress", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showPhone">ફોન નંબર</Label>
                      <Switch
                        id="showPhone"
                        checked={printSettings.showPhone}
                        onCheckedChange={(checked) => handlePrintSettingsChange("showPhone", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeCalculations">ગણતરીઓ</Label>
                      <Switch
                        id="includeCalculations"
                        checked={printSettings.includeCalculations}
                        onCheckedChange={(checked) => handlePrintSettingsChange("includeCalculations", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeNotes">નોંધો</Label>
                      <Switch
                        id="includeNotes"
                        checked={printSettings.includeNotes}
                        onCheckedChange={(checked) => handlePrintSettingsChange("includeNotes", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ફોર્મેટ સેટિંગ્સ</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="printFormat">પેપર સાઇઝ</Label>
                      <select
                        id="printFormat"
                        value={printSettings.printFormat}
                        onChange={(e) => handlePrintSettingsChange("printFormat", e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="A4">A4</option>
                        <option value="A5">A5</option>
                        <option value="Letter">Letter</option>
                        <option value="Receipt">Receipt (80mm)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="fontSize">ફોન્ટ સાઇઝ</Label>
                      <select
                        id="fontSize"
                        value={printSettings.fontSize}
                        onChange={(e) => handlePrintSettingsChange("fontSize", e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="small">નાનું</option>
                        <option value="medium">મધ્યમ</option>
                        <option value="large">મોટું</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                નોટિફિકેશન સેટિંગ્સ
              </CardTitle>
              <CardDescription>અલર્ટ અને નોટિફિકેશન પ્રાથમિકતાઓ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">સિસ્ટમ અલર્ટ</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="orderConfirmation">ઓર્ડર કન્ફર્મેશન</Label>
                      <Switch
                        id="orderConfirmation"
                        checked={notificationSettings.orderConfirmation}
                        onCheckedChange={(checked) => handleNotificationSettingsChange("orderConfirmation", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="statusUpdates">સ્ટેટસ અપડેટ</Label>
                      <Switch
                        id="statusUpdates"
                        checked={notificationSettings.statusUpdates}
                        onCheckedChange={(checked) => handleNotificationSettingsChange("statusUpdates", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dailyReport">દૈનિક રિપોર્ટ</Label>
                      <Switch
                        id="dailyReport"
                        checked={notificationSettings.dailyReport}
                        onCheckedChange={(checked) => handleNotificationSettingsChange("dailyReport", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lowStock">ઓછો સ્ટોક</Label>
                      <Switch
                        id="lowStock"
                        checked={notificationSettings.lowStock}
                        onCheckedChange={(checked) => handleNotificationSettingsChange("lowStock", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">કમ્યુનિકેશન</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">ઈમેઈલ નોટિફિકેશન</Label>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationSettingsChange("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smsNotifications">SMS નોટિફિકેશન</Label>
                      <Switch
                        id="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationSettingsChange("smsNotifications", checked)}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>નોંધ:</strong> SMS અને ઈમેઈલ સેવાઓ માટે અલગથી કોન્ફિગરેશન જરૂરી છે.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                સિસ્ટમ સેટિંગ્સ
              </CardTitle>
              <CardDescription>ડેટાબેઝ અને સિસ્ટમ કોન્ફિગરેશન</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ડિફોલ્ટ વેલ્યુઝ</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="defaultOrderStatus">ડિફોલ્ટ ઓર્ડર સ્ટેટસ</Label>
                      <select
                        id="defaultOrderStatus"
                        value={systemSettings.defaultOrderStatus}
                        onChange={(e) => handleSystemSettingsChange("defaultOrderStatus", e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="નવો">નવો</option>
                        <option value="કન્ફર્મ">કન્ફર્મ</option>
                        <option value="પ્રોગ્રેસમાં">પ્રોગ્રેસમાં</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="defaultPeople">ડિફોલ્ટ લોકોની સંખ્યા</Label>
                      <Input
                        id="defaultPeople"
                        type="number"
                        value={systemSettings.defaultPeople}
                        onChange={(e) => handleSystemSettingsChange("defaultPeople", e.target.value)}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">કરન્સી</Label>
                      <select
                        id="currency"
                        value={systemSettings.currency}
                        onChange={(e) => handleSystemSettingsChange("currency", e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="₹">રૂપિયા (₹)</option>
                        <option value="$">ડોલર ($)</option>
                        <option value="€">યુરો (€)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">બેકઅપ સેટિંગ્સ</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoBackup">ઓટો બેકઅપ</Label>
                      <Switch
                        id="autoBackup"
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => handleSystemSettingsChange("autoBackup", checked)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="backupFrequency">બેકઅપ આવર્તન</Label>
                      <select
                        id="backupFrequency"
                        value={systemSettings.backupFrequency}
                        onChange={(e) => handleSystemSettingsChange("backupFrequency", e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                        disabled={!systemSettings.autoBackup}
                      >
                        <option value="daily">દૈનિક</option>
                        <option value="weekly">સાપ્તાહિક</option>
                        <option value="monthly">માસિક</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="dataRetention">ડેટા રીટેન્શન</Label>
                      <select
                        id="dataRetention"
                        value={systemSettings.dataRetention}
                        onChange={(e) => handleSystemSettingsChange("dataRetention", e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="6months">6 મહિના</option>
                        <option value="1year">1 વર્ષ</option>
                        <option value="2years">2 વર્ષ</option>
                        <option value="forever">હંમેશા</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                ડેટા મેનેજમેન્ટ
              </CardTitle>
              <CardDescription>ડેટા એક્સપોર્ટ, ઇમ્પોર્ટ અને બેકઅપ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button onClick={exportData} variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  ડેટા એક્સપોર્ટ
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  ડેટા ઇમ્પોર્ટ
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <RefreshCw className="w-4 h-4" />
                  બેકઅપ બનાવો
                </Button>
                <Button
                  onClick={clearAllData}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                  બધો ડેટા ડિલીટ
                </Button>
              </div>

              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ ચેતવણી</h4>
                <p className="text-sm text-red-700">
                  "બધો ડેટા ડિલીટ" બટન બધા ઓર્ડર્સ, કેટેગરીઓ અને સેટિંગ્સ કાયમ માટે ડિલીટ કરી દેશે. આ ક્રિયા પાછી કરી શકાશે નહીં. કૃપા
                  કરીને પહેલા બેકઅપ લો.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
