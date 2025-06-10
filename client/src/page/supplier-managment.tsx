import { useState, useEffect } from 'react'
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Trash, Edit, Plus, Search, X, Building2, FileText, Globe, MapPin, Phone, User, Mail } from "lucide-react"
import { useNavigate } from 'react-router-dom'

// MongoDB Supplier Model
interface Supplier {
  _id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  tradeLicense: string
  trnNumber: string
  jurisdiction: string
  establishmentYear: string
  bankDetails: string
}

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState<Omit<Supplier, '_id'>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    tradeLicense: '',
    trnNumber: '',
    jurisdiction: '',
    establishmentYear: '',
    bankDetails: ''
  })
  const navigate = useNavigate()

  // Get auth token from storage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || ''
  }

  // Fetch suppliers from MongoDB
  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })

      // Handle unauthorized (redirect to login)
      if (response.status === 401) {
        navigate('/login')
        return
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch suppliers')
      }

      setSuppliers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const url = editingSupplier 
        ? `/api/suppliers/${editingSupplier._id}`
        : '/api/suppliers'
      const method = editingSupplier ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData),
      })

      // Handle unauthorized
      if (response.status === 401) {
        navigate('/login')
        return
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save supplier')
      }

      if (editingSupplier) {
        setSuppliers(suppliers.map(s => 
          s._id === data._id ? data : s
        ))
      } else {
        setSuppliers([...suppliers, data])
      }

      resetForm()
      fetchSuppliers() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })

      // Handle unauthorized
      if (response.status === 401) {
        navigate('/login')
        return
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete supplier')
      }

      setSuppliers(suppliers.filter(s => s._id !== id))
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
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      tradeLicense: '',
      trnNumber: '',
      jurisdiction: '',
      establishmentYear: '',
      bankDetails: ''
    })
    setEditingSupplier(null)
    setIsModalOpen(false)
    setError('')
  }

  const openAddSupplierModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      tradeLicense: supplier.tradeLicense,
      trnNumber: supplier.trnNumber,
      jurisdiction: supplier.jurisdiction,
      establishmentYear: supplier.establishmentYear,
      bankDetails: supplier.bankDetails
    })
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4 space-y-6 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Supplier Management</h1>
            <p className="text-blue-600">Manage your UAE-based suppliers</p>
          </div>
          <Button 
            onClick={openAddSupplierModal}
            className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            placeholder="Search suppliers by name, contact or email..."
            className="pl-10 border-blue-200 focus:border-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Supplier Table */}
        {!loading && (
          <Card className="border border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <CardTitle className="text-blue-800">Supplier Directory</CardTitle>
                  <CardDescription className="text-blue-600">
                    {filteredSuppliers.length} {filteredSuppliers.length === 1 ? 'supplier' : 'suppliers'} registered
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-blue-800">Company</TableHead>
                      <TableHead className="text-blue-800 hidden md:table-cell">License/TRN</TableHead>
                      <TableHead className="text-blue-800">Contact</TableHead>
                      <TableHead className="text-blue-800 hidden lg:table-cell">Location</TableHead>
                      <TableHead className="text-right text-blue-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No suppliers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSuppliers.map(supplier => (
                        <TableRow key={supplier._id} className="hover:bg-blue-50">
                          <TableCell>
                            <div className="font-medium text-blue-900">{supplier.name}</div>
                            <div className="text-sm text-blue-600 flex items-center md:hidden">
                              <FileText className="h-3 w-3 mr-1" />
                              {supplier.tradeLicense}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="text-sm text-blue-900">
                              <div className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {supplier.tradeLicense}
                              </div>
                              <div className="flex items-center">
                                <Globe className="h-3 w-3 mr-1" />
                                {supplier.trnNumber}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-blue-900">{supplier.contactPerson}</div>
                            <div className="text-sm text-blue-600 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {supplier.email}
                            </div>
                            <div className="text-sm text-blue-600 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {supplier.phone}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="text-sm text-blue-900 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {supplier.jurisdiction}
                            </div>
                            <div className="text-xs text-blue-600">{supplier.address}</div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(supplier)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(supplier._id)}
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

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-blue-100 p-4 bg-blue-50 rounded-t-lg">
                <h2 className="text-xl font-semibold text-blue-800">
                  {editingSupplier ? 'Edit Supplier Details' : 'Register New UAE Supplier'}
                </h2>
                <button 
                  onClick={resetForm}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-blue-800 border-b border-blue-100 pb-2 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Company Information
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-800">Company Name (Legal Entity) *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. ABC Trading LLC"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tradeLicense" className="text-blue-800">Trade License Number *</Label>
                      <Input
                        id="tradeLicense"
                        name="tradeLicense"
                        value={formData.tradeLicense}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. 12345678"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trnNumber" className="text-blue-800">TRN (Tax Registration Number) *</Label>
                      <Input
                        id="trnNumber"
                        name="trnNumber"
                        value={formData.trnNumber}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. 1000000001"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jurisdiction" className="text-blue-800">Jurisdiction *</Label>
                      <Input
                        id="jurisdiction"
                        name="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. Dubai Mainland"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="establishmentYear" className="text-blue-800">Year of Establishment *</Label>
                      <Input
                        id="establishmentYear"
                        name="establishmentYear"
                        value={formData.establishmentYear}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. 2015"
                      />
                    </div>
                  </div>

                  {/* Contact & Banking */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-blue-800 border-b border-blue-100 pb-2 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Contact & Banking
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson" className="text-blue-800">Authorized Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. Ahmed Al Maktoum"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-800">Company Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. contact@company.ae"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-800">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. +971501234567"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-blue-800">Registered Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. Dubai Silicon Oasis, Dubai, UAE"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bankDetails" className="text-blue-800">Bank Account Details *</Label>
                      <Input
                        id="bankDetails"
                        name="bankDetails"
                        value={formData.bankDetails}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="e.g. Emirates NBD, Account #1234567890"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col-reverse md:flex-row justify-end gap-2 pt-6 border-t border-blue-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : editingSupplier ? 'Update Supplier' : 'Register Supplier'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}