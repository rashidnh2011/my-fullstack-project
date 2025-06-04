import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Box, IconButton, Chip, Card, CardContent, CardHeader, Grid
} from '@mui/material';
import {
  ArrowBackIos, ArrowForwardIos, LocalAtm, PointOfSale, LocalDining,
  DeliveryDining, Fastfood, TakeoutDining, PieChart as PieChartIcon, BarChart as BarChartIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';

const MetricCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
});

const DateNavigator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: '8px',
  marginBottom: theme.spacing(2)
}));

const OrderTypeCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'dominant',
})(({ theme, dominant }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: dominant ? theme.palette.primary.light : theme.palette.background.paper,
  color: dominant ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'scale(1.03)'
  }
}));

const mockData = {
  date: '26/05/2025',
  totalSales: 461.80,
  paymentMethods: [
    { method: 'POS', amount: 320.50 },
    { method: 'Cash', amount: 141.30 }
  ],
  orderTypes: [
    { type: 'Dine In', amount: 120.50, count: 15, icon: <LocalDining /> },
    { type: 'Home Delivery', amount: 80.25, count: 8, icon: <DeliveryDining /> },
    { type: 'Quick Order', amount: 60.75, count: 12, icon: <Fastfood /> },
    { type: 'Take Away', amount: 200.30, count: 25, icon: <TakeoutDining /> }
  ],
  categories: [
    { name: 'Fresh Juice', value: 150.50, color: '#8884d8' },
    { name: 'Open Item', value: 120.30, color: '#83a6ed' },
    { name: 'Beverages', value: 80.25, color: '#8dd1e1' },
    { name: 'Food', value: 60.75, color: '#82ca9d' },
    { name: 'Desserts', value: 50.00, color: '#a4de6c' }
  ],
  waiters: [
    { name: 'Imran', value: 200.50, color: '#ff8042' },
    { name: 'Ali', value: 120.30, color: '#ffbb28' },
    { name: 'Mohammed', value: 80.25, color: '#00c49f' },
    { name: 'Sarah', value: 60.75, color: '#0088fe' }
  ]
};

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 26));
  const [timeRange, setTimeRange] = useState('day');

  const dominantOrderType = mockData.orderTypes.reduce((prev, curr) => prev.amount > curr.amount ? prev : curr).type;

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePreviousDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div>
      {/* Your original dashboard heading */}
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to WMS Pro Dashboard</p>

      {/* Inserted sales dashboard UI */}
      <Box sx={{ padding: 3 }}>
        {/* Date navigation */}
        <DateNavigator>
          <IconButton onClick={handlePreviousDate}><ArrowBackIos /></IconButton>
          <span style={{ margin: '0 16px', fontWeight: 'bold' }}>{formatDate(currentDate)}</span>
          <IconButton onClick={handleNextDate}><ArrowForwardIos /></IconButton>
        </DateNavigator>

        {/* Time range chips */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          {['day', 'week', 'month'].map((range) => (
            <Chip
              key={range}
              label={range.charAt(0).toUpperCase() + range.slice(1)}
              onClick={() => setTimeRange(range)}
              color={timeRange === range ? 'primary' : 'default'}
              sx={{ marginX: 1 }}
            />
          ))}
        </Box>

        {/* Sales and order types */}
        <Grid container spacing={3} sx={{ marginBottom: 24 }}>
          <Grid item xs={12} md={6}>
            <MetricCard>
              <CardHeader
                title="Total Sales"
                avatar={<LocalAtm style={{ fontSize: 40 }} />}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <h2 style={{ fontWeight: 'bold' }}>QAR {mockData.totalSales.toFixed(2)}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PointOfSale style={{ marginRight: 8 }} />
                    <span>POS: QAR {mockData.paymentMethods.find(m => m.method === 'POS')?.amount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LocalAtm style={{ marginRight: 8 }} />
                    <span>Cash: QAR {mockData.paymentMethods.find(m => m.method === 'Cash')?.amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </MetricCard>
          </Grid>

          {mockData.orderTypes.map(order => (
            <Grid item xs={12} sm={6} md={3} key={order.type}>
              <OrderTypeCard dominant={order.type === dominantOrderType}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  {React.cloneElement(order.icon, { style: { fontSize: 40 } })}
                </div>
                <h3>{order.type}</h3>
                <h4 style={{ fontWeight: 'bold' }}>QAR {order.amount.toFixed(2)}</h4>
                <small>{order.count} orders</small>
                {order.type === dominantOrderType && (
                  <Chip label="Top Seller" size="small" color="primary" style={{ marginTop: 8 }} />
                )}
              </OrderTypeCard>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Category Sales Pie Chart */}
          <Grid item xs={12} md={6}>
            <MetricCard>
              <CardHeader title="Category Wise Sales" avatar={<PieChartIcon />} />
              <CardContent>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockData.categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockData.categories.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`QAR ${value}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </MetricCard>
          </Grid>

          {/* Waiter Performance Bar Chart */}
          <Grid item xs={12} md={6}>
            <MetricCard>
              <CardHeader title="Waiter Performance" avatar={<BarChartIcon />} />
              <CardContent>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData.waiters}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`QAR ${value}`, 'Sales']} />
                      <Legend />
                      <Bar dataKey="value">
                        {mockData.waiters.map((entry, idx) => (
                          <Cell key={`bar-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </MetricCard>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
