import { useState, useEffect } from 'react'
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Trash, Edit, Plus, Search, X, Box, Barcode, Package, Layers, Warehouse } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"

interface InventoryItem {
  _id: string
  sku: string
  name: string
  description: string
  category: string
  barcode: string
  barcodeType: 'single' | 'outer_box'
  barcodeOuterBox?: string
  unitOfMeasure: string
  costPrice: number
  sellingPrice: number
  taxRate: number
  currentStock: number
  minStockLevel: number
  supplierId?: string
  supplierName?: string
  warehouseId: string
  warehouseName: string
  location: string
  lastUpdated: string
  createdAt: string
}

interface Warehouse {
  _id: string
  name: string
  code: string
}

export default function InventoryMaster() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [formData, setFormData] = useState<Omit<InventoryItem, '_id' | 'lastUpdated' | 'createdAt'>>({
    sku: '',
    name: '',
    description: '',
    category: '',
    barcode: '',
    barcodeType: 'single',
    barcodeOuterBox: '',
    unitOfMeasure: 'pcs',
    costPrice: 0,
    sellingPrice: 0,
    taxRate: 5,
    currentStock: 0,
    minStockLevel: 5,
    supplierId: '',
    supplierName: '',
    warehouseId: '',
    warehouseName: '',
    location: ''
  })
  const [scanMode, setScanMode] = useState(false)
  const navigate = useNavigate()

  const categories = [
    'Electronics', 'Clothing', 'Groceries', 'Pharmaceuticals',
    'Stationery', 'Hardware', 'Toys', 'Home Appliances'
  ]

  const units = ['pcs', 'kg', 'g', 'L', 'mL', 'm', 'cm', 'box', 'pack']

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || ''
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const warehouseResponse = await fetch('/api/warehouses', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })

      if (warehouseResponse.status === 401) {
        navigate('/login')
        return
      }

      const warehouseData = await warehouseResponse.json()
      if (!warehouseResponse.ok) {
        throw new Error(warehouseData.message || 'Failed to fetch warehouses')
      }

      setWarehouses(warehouseData)

      const inventoryResponse = await fetch('/api/inventory', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })

      if (inventoryResponse.status === 401) {
        navigate('/login')
        return
      }

      const inventoryData = await inventoryResponse.json()
      if (!inventoryResponse.ok) {
        throw new Error(inventoryData.message || 'Failed to fetch inventory')
      }

      setInventory(inventoryData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.barcode.includes(searchTerm) ||
    (item.barcodeOuterBox && item.barcodeOuterBox.includes(searchTerm)) ||
    item.warehouseName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (!formData.barcode) {
        throw new Error('Barcode is required')
      }
      
      if (formData.barcodeType === 'outer_box' && !formData.barcodeOuterBox) {
        throw new Error('Outer box barcode is required for this type')
      }

      if (!formData.warehouseId) {
        throw new Error('Warehouse is required')
      }

      const url = editingItem 
        ? `/api/inventory/${editingItem._id}`
        : '/api/inventory'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData),
      })

      if (response.status === 401) {
        navigate('/login')
        return
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save inventory item')
      }

      if (editingItem) {
        setInventory(inventory.map(item => 
          item._id === data._id ? data : item
        ))
      } else {
        setInventory([...inventory, data])
      }

      resetForm()
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })

      if (response.status === 401) {
        navigate('/login')
        return
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete inventory item')
      }

      setInventory(inventory.filter(item => item._id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'costPrice' || name === 'sellingPrice' || name === 'taxRate' || 
              name === 'currentStock' || name === 'minStockLevel'
        ? parseFloat(value) || 0
        : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'warehouseId') {
      const selectedWarehouse = warehouses.find(w => w._id === value)
      setFormData(prev => ({
        ...prev,
        warehouseId: value,
        warehouseName: selectedWarehouse?.name || '',
        location: selectedWarehouse?.code || ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleBarcodeTypeChange = (value: 'single' | 'outer_box') => {
    setFormData(prev => ({
      ...prev,
      barcodeType: value,
      barcodeOuterBox: value === 'outer_box' ? prev.barcodeOuterBox || '' : ''
    }))
  }

  const generateBarcode = (type: 'single' | 'outer_box') => {
    const prefix = type === 'single' ? 'S' : 'B'
    const randomNum = Math.floor(100000000000 + Math.random() * 900000000000)
    return `${prefix}${randomNum}`
  }

  const handleScanBarcode = (type: 'single' | 'outer_box') => {
    const barcode = generateBarcode(type)
    if (type === 'single') {
      setFormData(prev => ({ ...prev, barcode }))
    } else {
      setFormData(prev => ({ ...prev, barcodeOuterBox: barcode }))
    }
    setScanMode(false)
  }

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      category: '',
      barcode: '',
      barcodeType: 'single',
      barcodeOuterBox: '',
      unitOfMeasure: 'pcs',
      costPrice: 0,
      sellingPrice: 0,
      taxRate: 5,
      currentStock: 0,
      minStockLevel: 5,
      supplierId: '',
      supplierName: '',
      warehouseId: '',
      warehouseName: '',
      location: ''
    })
    setEditingItem(null)
    setIsModalOpen(false)
    setError('')
    setScanMode(false)
  }

  const openAddItemModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setFormData({
      sku: item.sku,
      name: item.name,
      description: item.description,
      category: item.category,
      barcode: item.barcode,
      barcodeType: item.barcodeType,
      barcodeOuterBox: item.barcodeOuterBox || '',
      unitOfMeasure: item.unitOfMeasure,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      taxRate: item.taxRate,
      currentStock: item.currentStock,
      minStockLevel: item.minStockLevel,
      supplierId: item.supplierId || '',
      supplierName: item.supplierName || '',
      warehouseId: item.warehouseId,
      warehouseName: item.warehouseName,
      location: item.location
    })
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4 space-y-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Inventory Master</h1>
            <p className="text-blue-600">Manage inventory with warehouse integration</p>
          </div>
          <Button 
            onClick={openAddItemModal}
            className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            placeholder="Search inventory by name, SKU, barcode or warehouse..."
            className="pl-10 border-blue-200 focus:border-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && (
          <Card className="border border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <CardTitle className="text-blue-800">Inventory Items</CardTitle>
                  <CardDescription className="text-blue-600">
                    {filteredInventory.length} {filteredInventory.length === 1 ? 'item' : 'items'} in stock
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-blue-800">Item</TableHead>
                      <TableHead className="text-blue-800">SKU/Barcode</TableHead>
                      <TableHead className="text-blue-800">Price</TableHead>
                      <TableHead className="text-blue-800">Stock</TableHead>
                      <TableHead className="text-blue-800">Warehouse</TableHead>
                      <TableHead className="text-right text-blue-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No inventory items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInventory.map(item => (
                        <TableRow key={item._id} className="hover:bg-blue-50">
                          <TableCell>
                            <div className="font-medium text-blue-900">{item.name}</div>
                            <div className="text-sm text-blue-600">{item.category}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-blue-900 flex items-center">
                              <Barcode className="h-3 w-3 mr-1" />
                              {item.sku}
                            </div>
                            <div className="text-xs text-blue-600">
                              {item.barcodeType === 'outer_box' ? (
                                <span className="flex items-center">
                                  <Layers className="h-3 w-3 mr-1" />
                                  {item.barcode} (Unit) / {item.barcodeOuterBox} (Box)
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Package className="h-3 w-3 mr-1" />
                                  {item.barcode}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-blue-900">
                              AED {item.sellingPrice.toFixed(2)}
                            </div>
                            <div className="text-xs text-blue-600">
                              Cost: AED {item.costPrice.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-blue-900">
                              {item.currentStock} {item.unitOfMeasure}
                            </div>
                            <div className={`text-xs ${
                              item.currentStock <= item.minStockLevel 
                                ? 'text-red-600' 
                                : 'text-blue-600'
                            }`}>
                              Min: {item.minStockLevel}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-blue-900 flex items-center">
                              <Warehouse className="h-3 w-3 mr-1" />
                              {item.warehouseName}
                            </div>
                            <div className="text-xs text-blue-600">
                              {item.location}
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-blue-100 p-4 bg-blue-50 rounded-t-lg">
                <h2 className="text-xl font-semibold text-blue-800">
                  {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h2>
                <button 
                  onClick={resetForm}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-blue-800 border-b border-blue-100 pb-2 flex items-center">
                      <Box className="h-4 w-4 mr-2" />
                      Basic Information
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sku" className="text-blue-800">SKU *</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. PROD-1001"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-800">Item Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. Premium Coffee Beans"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-blue-800">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="Product details..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-blue-800">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unitOfMeasure" className="text-blue-800">Unit of Measure *</Label>
                      <Select
                        value={formData.unitOfMeasure}
                        onValueChange={(value) => handleSelectChange('unitOfMeasure', value)}
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map(unit => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Additional form fields can be added here */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}