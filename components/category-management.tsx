"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { useCategories } from "@/hooks/useCategories"
import { useManufacturingItems } from "@/hooks/useManufacturingItems"

export default function CategoryManagement() {
  const { categories, loading: categoriesLoading, createCategory, updateCategory, deleteCategory } = useCategories()
  const { items: manufacturingItems, loading: itemsLoading, createItem, deleteItem } = useManufacturingItems()

  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newItem, setNewItem] = useState({
    name: "",
    vegetables: "",
    baseQuantity: "",
    type: "bhajiya",
    categoryId: null,
  })
  const [newManufacturingItem, setNewManufacturingItem] = useState({
    name: "",
    baseQuantity: "",
    per: "",
  })

  const handleAddCategory = async () => {
    if (newCategory.name && newCategory.description) {
      try {
        await createCategory({
          name: newCategory.name,
          description: newCategory.description,
          items: [],
        })
        setNewCategory({ name: "", description: "" })
      } catch (error) {
        alert("કેટેગરી ઉમેરવામાં ભૂલ: " + error.message)
      }
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (confirm("શું તમે ખરેખર આ કેટેગરી ડિલીટ કરવા માંગો છો?")) {
      try {
        await deleteCategory(categoryId)
      } catch (error) {
        alert("કેટેગરી ડિલીટ કરવામાં ભૂલ: " + error.message)
      }
    }
  }

  const handleAddItemToCategory = async (categoryId) => {
    if (newItem.name && newItem.vegetables && newItem.baseQuantity) {
      try {
        const category = categories.find((cat) => cat._id === categoryId)
        if (!category) return

        const item = {
          id: Date.now(),
          name: newItem.name,
          vegetables: newItem.vegetables.split(",").map((v) => v.trim()),
          baseQuantity: Number.parseInt(newItem.baseQuantity),
          type: newItem.type,
        }

        const updatedItems = [...category.items, item]
        await updateCategory(categoryId, { items: updatedItems })

        setNewItem({ name: "", vegetables: "", baseQuantity: "", type: "bhajiya", categoryId: null })
      } catch (error) {
        alert("આઇટમ ઉમેરવામાં ભૂલ: " + error.message)
      }
    }
  }

  const handleDeleteItemFromCategory = async (categoryId, itemId) => {
    try {
      const category = categories.find((cat) => cat._id === categoryId)
      if (!category) return

      const updatedItems = category.items.filter((item) => item.id !== itemId)
      await updateCategory(categoryId, { items: updatedItems })
    } catch (error) {
      alert("આઇટમ ડિલીટ કરવામાં ભૂલ: " + error.message)
    }
  }

  const handleAddManufacturingItem = async () => {
    if (newManufacturingItem.name && newManufacturingItem.baseQuantity && newManufacturingItem.per) {
      try {
        await createItem({
          name: newManufacturingItem.name,
          baseQuantity: Number.parseInt(newManufacturingItem.baseQuantity),
          per: Number.parseInt(newManufacturingItem.per),
        })
        setNewManufacturingItem({ name: "", baseQuantity: "", per: "" })
      } catch (error) {
        alert("મેન્યુફેક્ચરિંગ આઇટમ ઉમેરવામાં ભૂલ: " + error.message)
      }
    }
  }

  const handleDeleteManufacturingItem = async (itemId) => {
    if (confirm("શું તમે ખરેખર આ આઇટમ ડિલીટ કરવા માંગો છો?")) {
      try {
        await deleteItem(itemId)
      } catch (error) {
        alert("મેન્યુફેક્ચરિંગ આઇટમ ડિલીટ કરવામાં ભૂલ: " + error.message)
      }
    }
  }

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">લોડ થઈ રહ્યું છે...</span>
      </div>
    )
  }

  // ... rest of the JSX remains the same, just replace the handlers with the new async ones
  return (
    <div className="max-w-6xl mx-auto">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">કેટેગરી અને આઇટમ્સ</TabsTrigger>
          <TabsTrigger value="manufacturing">મેન્યુફેક્ચરિંગ આઇટમ્સ</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          {/* Add New Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                નવી કેટેગરી ઉમેરો
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="categoryName">કેટેગરીનું નામ</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="કેટેગરીનું નામ"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">વર્ણન</Label>
                  <Input
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="કેટેગરીનું વર્ણન"
                  />
                </div>
                <div>
                  <Button onClick={handleAddCategory} className="bg-green-600 hover:bg-green-700 w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    ઉમેરો
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories List */}
          <div className="space-y-6">
            {categories.map((category) => (
              <Card key={category._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{category.items.length} આઇટમ્સ</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Item to Category */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">નવી આઇટમ ઉમેરો</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        placeholder="આઇટમનું નામ"
                        value={newItem.categoryId === category._id ? newItem.name : ""}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                            categoryId: category._id,
                          }))
                        }
                      />
                      <Input
                        placeholder="શાકભાજી (કોમા વડે અલગ)"
                        value={newItem.categoryId === category._id ? newItem.vegetables : ""}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            vegetables: e.target.value,
                            categoryId: category._id,
                          }))
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="number"
                          placeholder="બેઝ ક્વોન્ટિટી (g)"
                          value={newItem.categoryId === category._id ? newItem.baseQuantity : ""}
                          onChange={(e) =>
                            setNewItem((prev) => ({
                              ...prev,
                              baseQuantity: e.target.value,
                              categoryId: category._id,
                            }))
                          }
                        />
                        <select
                          className="p-2 border rounded-md"
                          value={newItem.categoryId === category._id ? newItem.type : "bhajiya"}
                          onChange={(e) =>
                            setNewItem((prev) => ({
                              ...prev,
                              type: e.target.value,
                              categoryId: category._id,
                            }))
                          }
                        >
                          <option value="bhajiya">ભજિયા</option>
                          <option value="chaat">ચાટ</option>
                        </select>
                      </div>
                      <Button
                        onClick={() => handleAddItemToCategory(category._id)}
                        className="bg-blue-600 hover:bg-blue-700 w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        આઇટમ ઉમેરો
                      </Button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{item.name}</span>
                            <Badge
                              className={
                                item.type === "chaat" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                              }
                            >
                              {item.type === "chaat" ? "ચાટ" : "ભજિયા"}
                            </Badge>
                            <span className="text-sm text-gray-600">({item.baseQuantity}g)</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">શાકભાજી: {item.vegetables.join(", ")}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItemFromCategory(category._id, item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manufacturing" className="space-y-6">
          {/* Add Manufacturing Item */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                નવી મેન્યુફેક્ચરિંગ આઇટમ ઉમેરો
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="manufacturingName">આઇટમનું નામ</Label>
                  <Input
                    id="manufacturingName"
                    value={newManufacturingItem.name}
                    onChange={(e) => setNewManufacturingItem((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="આઇટમનું નામ"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="baseQuantity">બેઝ ક્વોન્ટિટી</Label>
                    <Input
                      id="baseQuantity"
                      type="number"
                      value={newManufacturingItem.baseQuantity}
                      onChange={(e) => setNewManufacturingItem((prev) => ({ ...prev, baseQuantity: e.target.value }))}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="per">કેટલા લોકો પર</Label>
                    <Input
                      id="per"
                      type="number"
                      value={newManufacturingItem.per}
                      onChange={(e) => setNewManufacturingItem((prev) => ({ ...prev, per: e.target.value }))}
                      placeholder="50"
                    />
                  </div>
                </div>
                <Button onClick={handleAddManufacturingItem} className="bg-green-600 hover:bg-green-700 w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  ઉમેરો
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manufacturing Items List */}
          <Card>
            <CardHeader>
              <CardTitle>મેન્યુફેક્ચરિંગ આઇટમ્સ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {manufacturingItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <div className="text-sm text-gray-600">
                        {item.baseQuantity} પીસ પ્રતિ {item.per} લોકો
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteManufacturingItem(item._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
