import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Trash,
  Edit,
  Plus,
  Search,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Calendar,
  Shield,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";

// MongoDB Customer Model for UAE
interface Customer {
  _id: string;
  customerType: "Individual" | "Corporate";
  // Individual Customer Fields
  fullName: string;
  emiratesId: string;
  passportNumber?: string;
  nationality: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  // Corporate Customer Fields
  companyName?: string;
  tradeLicense?: string;
  trnNumber?: string;
  // Common Fields
  email: string;
  mobile: string;
  alternateMobile?: string;
  address: string;
  emirate: string;
  poBox?: string;
  preferredLanguage: "English" | "Arabic";
  paymentMethods: {
    type: "Cash" | "Card" | "Bank Transfer" | "Digital Wallet";
    details?: string;
  }[];
  kycVerified: boolean;
  createdAt: string;
  lastUpdated: string;
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<
    Omit<Customer, "_id" | "createdAt" | "lastUpdated">
  >({
    customerType: "Individual",
    fullName: "",
    emiratesId: "",
    passportNumber: "",
    nationality: "United Arab Emirates",
    dob: "",
    gender: "Male",
    companyName: "",
    tradeLicense: "",
    trnNumber: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    address: "",
    emirate: "Dubai",
    poBox: "",
    preferredLanguage: "English",
    paymentMethods: [],
    kycVerified: false,
  });
  const [newPaymentMethod, setNewPaymentMethod] = useState<{
    type: "Cash" | "Card" | "Bank Transfer" | "Digital Wallet";
    details: string;
  }>({
    type: "Cash",
    details: "",
  });
  const navigate = useNavigate();

  // UAE Emirates list
  const emirates = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
  ];

  // Common nationalities in UAE
  const nationalities = [
    "United Arab Emirates",
    "India",
    "Pakistan",
    "Bangladesh",
    "Philippines",
    "Egypt",
    "Jordan",
    "Lebanon",
    "Syria",
    "United Kingdom",
    "United States",
    "Canada",
  ];

  // Get auth token from storage
  const getAuthToken = () => {
    return localStorage.getItem("authToken") || "";
  };

  // Fetch customers from MongoDB
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      // Get auth token from localStorage
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null;
      const searchQuery = searchTerm
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await fetch(`/api/customers${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        if (response.status === 404) {
          throw new Error("Backend server is not running. Please start the Backend Server workflow.");
        }
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Cannot connect to backend server. Please start the Backend Server workflow.");
      } else {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.customerType === "Individual"
      ? customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.emiratesId.includes(searchTerm) ||
        customer.mobile.includes(searchTerm)
      : customer.companyName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customer.tradeLicense?.includes(searchTerm) ||
        customer.trnNumber?.includes(searchTerm),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerType) {
      setError("Please select a customer type");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get auth token from localStorage
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null;

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const url = editingCustomer 
        ? `/api/customers/${editingCustomer._id}`
        : '/api/customers';

      const method = editingCustomer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
           navigate("/login");
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to save customer');
      }

      await fetchCustomers();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      setError("");

      // Get auth token from localStorage
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null;

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete customer');
      }

      await fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'customerType') {
      // Clear type-specific fields when switching customer type
      const clearedData = { ...formData };
      if (value === 'Corporate') {
        // Clear individual fields
        clearedData.fullName = '';
        clearedData.emiratesId = '';
        clearedData.passportNumber = '';
        clearedData.nationality = 'United Arab Emirates';
        clearedData.dob = '';
        clearedData.gender = 'Male';
      } else {
        // Clear corporate fields
        clearedData.companyName = '';
        clearedData.tradeLicense = '';
        clearedData.trnNumber = '';
      }
      setFormData({
        ...clearedData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCustomerTypeChange = (value: "Individual" | "Corporate") => {
    setFormData((prev) => ({
      ...prev,
      customerType: value,
      // Reset fields when switching types
      ...(value === "Individual"
        ? {
            companyName: "",
            tradeLicense: "",
            trnNumber: "",
          }
        : {
            fullName: "",
            emiratesId: "",
            passportNumber: "",
            nationality: "United Arab Emirates",
            dob: "",
            gender: "Male",
          }),
    }));
  };

  const addPaymentMethod = () => {
    if (!newPaymentMethod.type) return;

    setFormData((prev) => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, newPaymentMethod],
    }));
    setNewPaymentMethod({ type: "Cash", details: "" });
  };

  const removePaymentMethod = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      customerType: "Individual",
      fullName: "",
      emiratesId: "",
      passportNumber: "",
      nationality: "United Arab Emirates",
      dob: "",
      gender: "Male",
      companyName: "",
      tradeLicense: "",
      trnNumber: "",
      email: "",
      mobile: "",
      alternateMobile: "",
      address: "",
      emirate: "Dubai",
      poBox: "",
      preferredLanguage: "English",
      paymentMethods: [],
      kycVerified: false,
    });
    setEditingCustomer(null);
    setIsModalOpen(false);
    setError("");
  };

  const openAddCustomerModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      customerType: customer.customerType,
      fullName: customer.fullName,
      emiratesId: customer.emiratesId,
      passportNumber: customer.passportNumber || "",
      nationality: customer.nationality,
      dob: customer.dob,
      gender: customer.gender,
      companyName: customer.companyName || "",
      tradeLicense: customer.tradeLicense || "",
      trnNumber: customer.trnNumber || "",
      email: customer.email,
      mobile: customer.mobile,
      alternateMobile: customer.alternateMobile || "",
      address: customer.address,
      emirate: customer.emirate,
      poBox: customer.poBox || "",
      preferredLanguage: customer.preferredLanguage,
      paymentMethods: customer.paymentMethods,
      kycVerified: customer.kycVerified,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4 space-y-6 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              Customer Management
            </h1>
            <p className="text-blue-600">
              Manage your UAE customers with KYC compliance
            </p>
          </div>
          <Button
            onClick={openAddCustomerModal}
            className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            placeholder="Search customers by name, Emirates ID, mobile, or company..."
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

        {/* Customer Table */}
        {!loading && (
          <Card className="border border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <CardTitle className="text-blue-800">
                    Customer Directory
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    {filteredCustomers.length}{" "}
                    {filteredCustomers.length === 1 ? "customer" : "customers"}{" "}
                    registered
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-blue-800">Customer</TableHead>
                      <TableHead className="text-blue-800">ID/TRN</TableHead>
                      <TableHead className="text-blue-800">Contact</TableHead>
                      <TableHead className="text-blue-800 hidden lg:table-cell">
                        Address
                      </TableHead>
                      <TableHead className="text-blue-800">KYC</TableHead>
                      <TableHead className="text-right text-blue-800">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-gray-500"
                        >
                          No customers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow
                          key={customer._id}
                          className="hover:bg-blue-50"
                        >
                          <TableCell>
                            <div className="font-medium text-blue-900">
                              {customer.customerType === "Individual"
                                ? customer.fullName
                                : customer.companyName}
                            </div>
                            <div className="text-sm text-blue-600">
                              {customer.customerType}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-blue-900 flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              {customer.customerType === "Individual"
                                ? customer.emiratesId
                                : customer.trnNumber || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-blue-900 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {customer.mobile}
                            </div>
                            <div className="text-sm text-blue-600 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {customer.email}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="text-sm text-blue-900 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {customer.emirate}
                            </div>
                            <div className="text-xs text-blue-600">
                              {customer.address}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                customer.kycVerified ? "default" : "secondary"
                              }
                            >
                              {customer.kycVerified ? "Verified" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(customer)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(customer._id)}
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-blue-100 p-4 bg-blue-50 rounded-t-lg">
                <h2 className="text-xl font-semibold text-blue-800">
                  {editingCustomer
                    ? "Edit Customer Details"
                    : "Register New Customer (UAE KYC)"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label
                      htmlFor="individual"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        id="individual"
                        name="customerType"
                        checked={formData.customerType === "Individual"}
                        onChange={() => handleCustomerTypeChange("Individual")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span>Individual</span>
                    </Label>
                    <Label
                      htmlFor="corporate"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        id="corporate"
                        name="customerType"
                        checked={formData.customerType === "Corporate"}
                        onChange={() => handleCustomerTypeChange("Corporate")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span>Corporate</span>
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Individual Fields */}
                    {formData.customerType === "Individual" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-blue-800">
                            Full Name (as per Emirates ID) *
                          </Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="border-blue-200 focus:border-blue-400"
                            placeholder="Ahmed Mohammed Al Maktoum"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emiratesId" className="text-blue-800">
                            Emirates ID Number *
                          </Label>
                          <Input
                            id="emiratesId"
                            name="emiratesId"
                            value={formData.emiratesId}
                            onChange={handleInputChange}
                            required
                            className="border-blue-200 focus:border-blue-400"
                            placeholder="784-1990-1234567-1"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="passportNumber"
                            className="text-blue-800"
                          >
                            Passport Number
                          </Label>
                          <Input
                            id="passportNumber"
                            name="passportNumber"
                            value={formData.passportNumber}
                            onChange={handleInputChange}
                            className="border-blue-200 focus:border-blue-400"
                            placeholder="A12345678"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="nationality"
                            className="text-blue-800"
                          >
                            Nationality *
                          </Label>
                          <Select
                            value={formData.nationality}
                            onValueChange={(value) =>
                              handleSelectChange("nationality", value)
                            }
                          >
                            <SelectTrigger className="border-blue-200 focus:border-blue-400">
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              {nationalities.map((nationality) => (
                                <SelectItem
                                  key={nationality}
                                  value={nationality}
                                >
                                  {nationality}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dob" className="text-blue-800">
                            Date of Birth *
                          </Label>
                          <Input
                            id="dob"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleInputChange}
                            required
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender" className="text-blue-800">
                            Gender *
                          </Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) =>
                              handleSelectChange("gender", value)
                            }
                          >
                            <SelectTrigger className="border-blue-200 focus:border-blue-400">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {/* Corporate Fields */}
                    {formData.customerType === "Corporate" && (
                      <>
                        <div className="space-y-2">
                          <Label
                            htmlFor="companyName"
                            className="text-blue-800"
                          >
                            Company Name *
                          </Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                            className="border-blue-200 focus:border-blue-400"
                            placeholder="ABC Trading LLC"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="tradeLicense"
                            className="text-blue-800"
                          >
                            Trade License Number *
                          </Label>
                          <Input
                            id="tradeLicense"
                            name="tradeLicense"
                            value={formData.tradeLicense}
                            onChange={handleInputChange}
                            required
                            className="border-blue-200 focus:border-blue-400"
                            placeholder="12345678"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="trnNumber" className="text-blue-800">
                            TRN (Tax Registration Number) *
                          </Label>
                          <Input
                            id="trnNumber"
                            name="trnNumber"
                            value={formData.trnNumber}
                            onChange={handleInputChange}
                            required
                            className="border-blue-200 focus:border-blue-400"
                            placeholder="1000000001"
                          />
                        </div>
                      </>
                    )}

                    {/* Common Fields */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-800">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="customer@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-blue-800">
                        Mobile Number (UAE) *
                      </Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="+971501234567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="alternateMobile"
                        className="text-blue-800"
                      >
                        Alternate Mobile
                      </Label>
                      <Input
                        id="alternateMobile"
                        name="alternateMobile"
                        type="tel"
                        value={formData.alternateMobile}
                        onChange={handleInputChange}
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="+971501234567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emirate" className="text-blue-800">
                        Emirate *
                      </Label>
                      <Select
                        value={formData.emirate}
                        onValueChange={(value) =>
                          handleSelectChange("emirate", value)
                        }
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Select emirate" />
                        </SelectTrigger>
                        <SelectContent>
                          {emirates.map((emirate) => (
                            <SelectItem key={emirate} value={emirate}>
                              {emirate}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-blue-800">
                        Address *
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="Building, Street, Area"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="poBox" className="text-blue-800">
                        PO Box
                      </Label>
                      <Input
                        id="poBox"
                        name="poBox"
                        value={formData.poBox}
                        onChange={handleInputChange}
                        className="border-blue-200 focus:border-blue-400"
                        placeholder="12345"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="preferredLanguage"
                        className="text-blue-800"
                      >
                        Preferred Language *
                      </Label>
                      <Select
                        value={formData.preferredLanguage}
                        onValueChange={(value) =>
                          handleSelectChange("preferredLanguage", value)
                        }
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Arabic">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4 pt-4 border-t border-blue-100">
                    <h3 className="font-medium text-blue-800 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        value={newPaymentMethod.type}
                        onValueChange={(value) =>
                          setNewPaymentMethod((prev) => ({
                            ...prev,
                            type: value as
                              | "Cash"
                              | "Card"
                              | "Bank Transfer"
                              | "Digital Wallet",
                          }))
                        }
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="Digital Wallet">
                            Digital Wallet
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Details (e.g., card last 4 digits)"
                        value={newPaymentMethod.details}
                        onChange={(e) =>
                          setNewPaymentMethod((prev) => ({
                            ...prev,
                            details: e.target.value,
                          }))
                        }
                        className="border-blue-200 focus:border-blue-400"
                      />

                      <Button
                        type="button"
                        onClick={addPaymentMethod}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add Payment Method
                      </Button>
                    </div>

                    {formData.paymentMethods.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-blue-800">
                          Saved Payment Methods
                        </Label>
                        <div className="space-y-2">
                          {formData.paymentMethods.map((method, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 border border-blue-100 rounded"
                            >
                              <div>
                                <span className="font-medium">
                                  {method.type}
                                </span>
                                {method.details && (
                                  <span className="text-sm text-blue-600 ml-2">
                                    {method.details}
                                  </span>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePaymentMethod(index)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* KYC Verification */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-blue-100">
                    <input
                      type="checkbox"
                      id="kycVerified"
                      name="kycVerified"
                      checked={formData.kycVerified}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          kycVerified: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="kycVerified" className="text-blue-800 flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      KYC Verified
                    </Label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-blue-100">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        {editingCustomer ? 'Updating...' : 'Registering...'}
                      </span>
                    ) : (
                      editingCustomer ? 'Update Customer' : 'Register Customer'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}