import { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, CreditCard, Clock, ShoppingBag,
  Utensils, Users, TrendingUp, Home, 
  PieChart as PieChartIcon, BarChart2, LineChart as LineChartIcon
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

// Types
type SalesChannel = 'Dine-in' | 'Delivery' | 'Takeaway';
type PaymentMethod = 'Cash' | 'Card' | 'Digital Wallet';
type TimePeriod = 'day' | 'week' | 'month' | 'year';

interface OutletData {
  id: string;
  name: string;
  sales: number;
  transactions: number;
  sqFt: number;
  employees: number;
}

interface CategoryData {
  name: string;
  sales: number;
  margin: number;
  color: string;
}

interface HourlyData {
  hour: string;
  sales: number;
}

interface PaymentData {
  method: PaymentMethod;
  amount: number;
  percentage: number;
  color: string;
}

interface ChannelData {
  channel: SalesChannel;
  sales: number;
  percentage: number;
  color: string;
}

interface ProductData {
  id: string;
  name: string;
  category: string;
  sales: number;
  margin: number;
}

// Mock Data
const outlets: OutletData[] = [
  { id: '1', name: 'Main Branch', sales: 12500, transactions: 420, sqFt: 1200, employees: 8 },
  { id: '2', name: 'Mall Branch', sales: 9800, transactions: 380, sqFt: 900, employees: 6 },
  { id: '3', name: 'Airport Branch', sales: 15200, transactions: 510, sqFt: 1500, employees: 10 },
];

const categories: CategoryData[] = [
  { name: 'Beverages', sales: 8500, margin: 65, color: '#8884d8' },
  { name: 'Food', sales: 12500, margin: 60, color: '#82ca9d' },
  { name: 'Desserts', sales: 4200, margin: 70, color: '#ffc658' },
  { name: 'Merchandise', sales: 1800, margin: 50, color: '#ff8042' },
];

const hourlyData: HourlyData[] = [
  { hour: '8 AM', sales: 1200 },
  { hour: '10 AM', sales: 1800 },
  { hour: '12 PM', sales: 4500 },
  { hour: '2 PM', sales: 3200 },
  { hour: '4 PM', sales: 2800 },
  { hour: '6 PM', sales: 5200 },
  { hour: '8 PM', sales: 3800 },
];

const paymentMethods: PaymentData[] = [
  { method: 'Cash', amount: 8500, percentage: 30, color: '#8884d8' },
  { method: 'Card', amount: 15000, percentage: 55, color: '#82ca9d' },
  { method: 'Digital Wallet', amount: 4500, percentage: 15, color: '#ffc658' },
];

const salesChannels: ChannelData[] = [
  { channel: 'Dine-in', sales: 12000, percentage: 45, color: '#8884d8' },
  { channel: 'Delivery', sales: 10000, percentage: 35, color: '#82ca9d' },
  { channel: 'Takeaway', sales: 5000, percentage: 20, color: '#ffc658' },
];

const topProducts: ProductData[] = [
  { id: '1', name: 'Chicken Biryani', category: 'Food', sales: 4200, margin: 65 },
  { id: '2', name: 'Mango Lassi', category: 'Beverages', sales: 3800, margin: 70 },
  { id: '3', name: 'Chocolate Cake', category: 'Desserts', sales: 2500, margin: 75 },
  { id: '4', name: 'Veg Thali', category: 'Food', sales: 2300, margin: 60 },
  { id: '5', name: 'Branded T-Shirt', category: 'Merchandise', sales: 1500, margin: 50 },
];

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculations
  const totalSales = outlets.reduce((sum, outlet) => sum + outlet.sales, 0);
  const totalTransactions = outlets.reduce((sum, outlet) => sum + outlet.transactions, 0);
  const aov = totalSales / totalTransactions;
  const topOutlet = outlets.reduce((prev, current) => 
    (prev.sales > current.sales) ? prev : current
  );
  const topCategory = categories.reduce((prev, current) => 
    (prev.sales > current.sales) ? prev : current
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">POS Revenue Dashboard</h1>
      <p className="text-gray-600 mb-6">Comprehensive sales analytics across all outlets</p>

      {/* Time Period Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {['day', 'week', 'month', 'year'].map((period) => (
          <Button
            key={period}
            variant={timePeriod === period ? 'default' : 'outline'}
            onClick={() => setTimePeriod(period as TimePeriod)}
            className="capitalize"
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Executive Overview</TabsTrigger>
          <TabsTrigger value="outlets">Outlet Performance</TabsTrigger>
          <TabsTrigger value="categories">Category Trends</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Executive Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">QAR {totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12.5% from last {timePeriod}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +8.3% from last {timePeriod}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">QAR {aov.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +5.2% from last {timePeriod}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Outlet</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{topOutlet.name}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  QAR {topOutlet.sales.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales by Hour</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`QAR ${value.toLocaleString()}`, 'Sales']} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales by Channel</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesChannels}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="sales"
                      label={({ channel, percentage }) => `${channel} ${percentage}%`}
                    >
                      {salesChannels.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`QAR ${value.toLocaleString()}`, 'Sales']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentMethods}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="method" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`QAR ${value.toLocaleString()}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="amount" name="Amount">
                      {paymentMethods.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Products</CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">QAR {product.sales.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{product.margin}% margin</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Outlet Performance */}
      {activeTab === 'outlets' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outlet Comparison</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={outlets}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value: number) => [`QAR ${value.toLocaleString()}`, 'Sales']} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {outlets.map((outlet) => (
              <Card key={outlet.id}>
                <CardHeader>
                  <CardTitle>{outlet.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sales:</span>
                      <span className="font-medium">QAR {outlet.sales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transactions:</span>
                      <span className="font-medium">{outlet.transactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales/SqFt:</span>
                      <span className="font-medium">QAR {(outlet.sales / outlet.sqFt).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales/Employee:</span>
                      <span className="font-medium">QAR {(outlet.sales / outlet.employees).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Category Trends */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`QAR ${value.toLocaleString()}`, 'Sales']} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#8884d8" />
                  <Bar dataKey="margin" name="Margin %" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="sales"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {categories.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`QAR ${value.toLocaleString()}`, 'Sales']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{category.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">QAR {category.sales.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{category.margin}% margin</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;