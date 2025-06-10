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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Trash,
  Edit,
  Plus,
  Search,
  X,
  Warehouse,
  MapPin,
  Boxes,
  User,
  Phone,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";

interface Warehouse {
  _id: string;
  code: string;
  name: string;
  location: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  totalCapacity: number;
  usedCapacity: number;
  type: "Main" | "Regional" | "Cold Storage" | "Temporary";
  status: "Active" | "Inactive" | "Under Maintenance";
  createdAt: string;
  lastUpdated: string;
}

export default function WarehouseMaster() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [formData, setFormData] = useState<
    Omit<Warehouse, "_id" | "createdAt" | "lastUpdated" | "usedCapacity">
  >({
    code: "",
    name: "",
    location: "",
    address: "",
    contactPerson: "",
    contactNumber: "",
    totalCapacity: 0,
    type: "Main",
    status: "Active",
  });
  const navigate = useNavigate();

  // Warehouse types
  const warehouseTypes = ["Main", "Regional", "Cold Storage", "Temporary"];

  // Warehouse statuses
  const statuses = ["Active", "Inactive", "Under Maintenance"];

  // Get auth token from storage
  const getAuthToken = () => {
    return localStorage.getItem("authToken") || "";
  };

  // Fetch warehouses from MongoDB
  const fetchWarehouses = async () => {
    try {
      const response = await fetch("/api/warehouses", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch warehouses");
      }

      setWarehouses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Filter warehouses based on search term
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingWarehouse
        ? `/api/warehouses/${editingWarehouse._id}`
        : "/api/warehouses";
      const method = editingWarehouse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save warehouse");
      }

      if (editingWarehouse) {
        setWarehouses(warehouses.map((w) => (w._id === data._id ? data : w)));
      } else {
        setWarehouses([...warehouses, data]);
      }

      resetForm();
      fetchWarehouses();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/warehouses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete warehouse");
      }

      setWarehouses(warehouses.filter((w) => w._id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalCapacity" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      location: "",
      address: "",
      contactPerson: "",
      contactNumber: "",
      totalCapacity: 0,
      type: "Main",
      status: "Active",
    });
    setEditingWarehouse(null);
    setIsModalOpen(false);
    setError("");
  };

  const openAddWarehouseModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      code: warehouse.code,
      name: warehouse.name,
      location: warehouse.location,
      address: warehouse.address,
      contactPerson: warehouse.contactPerson,
      contactNumber: warehouse.contactNumber,
      totalCapacity: warehouse.totalCapacity,
      type: warehouse.type,
      status: warehouse.status,
    });
    setIsModalOpen(true);
  };

  const calculateCapacityPercentage = (used: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4 space-y-6 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              Warehouse Management
            </h1>
            <p className="text-blue-600">Manage your warehouse network</p>
          </div>
          <Button
            onClick={openAddWarehouseModal}
            className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Warehouse
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            placeholder="Search warehouses by name, code or location..."
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

        {/* Warehouse Table */}
        {!loading && (
          <Card className="border border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <CardTitle className="text-blue-800">
                    Warehouse Directory
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    {filteredWarehouses.length}{" "}
                    {filteredWarehouses.length === 1
                      ? "warehouse"
                      : "warehouses"}{" "}
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
                      <TableHead className="text-blue-800">Code</TableHead>
                      <TableHead className="text-blue-800">Warehouse</TableHead>
                      <TableHead className="text-blue-800">Location</TableHead>
                      <TableHead className="text-blue-800">Capacity</TableHead>
                      <TableHead className="text-blue-800">Type</TableHead>
                      <TableHead className="text-blue-800">Status</TableHead>
                      <TableHead className="text-right text-blue-800">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarehouses.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-gray-500"
                        >
                          No warehouses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWarehouses.map((warehouse) => (
                        <TableRow
                          key={warehouse._id}
                          className="hover:bg-blue-50"
                        >
                          <TableCell>
                            <div className="font-medium text-blue-900">
                              {warehouse.code}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-blue-900">
                              {warehouse.name}
                            </div>
                            <div className="text-sm text-blue-600 flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {warehouse.contactPerson}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-blue-900 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {warehouse.location}
                            </div>
                            <div className="text-xs text-blue-600">
                              {warehouse.address}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-blue-900">
                              {warehouse.usedCapacity} /{" "}
                              {warehouse.totalCapacity} units
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div
                                className={`h-2.5 rounded-full ${
                                  calculateCapacityPercentage(
                                    warehouse.usedCapacity,
                                    warehouse.totalCapacity,
                                  ) > 90
                                    ? "bg-red-500"
                                    : calculateCapacityPercentage(
                                          warehouse.usedCapacity,
                                          warehouse.totalCapacity,
                                        ) > 75
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${calculateCapacityPercentage(warehouse.usedCapacity, warehouse.totalCapacity)}%`,
                                }}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                warehouse.type === "Main"
                                  ? "default"
                                  : warehouse.type === "Regional"
                                    ? "secondary"
                                    : warehouse.type === "Cold Storage"
                                      ? "outline"
                                      : "destructive"
                              }
                            >
                              {warehouse.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                warehouse.status === "Active"
                                  ? "default"
                                  : warehouse.status === "Inactive"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {warehouse.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(warehouse)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(warehouse._id)}
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-blue-100 p-4 bg-blue-50 rounded-t-lg">
                <h2 className="text-xl font-semibold text-blue-800">
                  {editingWarehouse
                    ? "Edit Warehouse Details"
                    : "Add New Warehouse"}
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
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-blue-800">
                      Warehouse Code *
                    </Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="e.g. WH-DXB-001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-blue-800">
                      Warehouse Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="e.g. Dubai Main Warehouse"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-blue-800">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="e.g. Dubai Industrial City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-blue-800">
                      Full Address *
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
                    <Label htmlFor="contactPerson" className="text-blue-800">
                      Contact Person *
                    </Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="e.g. Warehouse Manager"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="text-blue-800">
                      Contact Number *
                    </Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="e.g. +971501234567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalCapacity" className="text-blue-800">
                      Total Capacity (units) *
                    </Label>
                    <Input
                      id="totalCapacity"
                      name="totalCapacity"
                      type="number"
                      min="0"
                      value={formData.totalCapacity}
                      onChange={handleInputChange}
                      required
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-blue-800">
                      Warehouse Type *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: string) =>
                        handleSelectChange("type", value)
                      }
                    >
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-blue-800">
                      Status *
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: string) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    {loading
                      ? "Processing..."
                      : editingWarehouse
                        ? "Update Warehouse"
                        : "Add Warehouse"}
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
