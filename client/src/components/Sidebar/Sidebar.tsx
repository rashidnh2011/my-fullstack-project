import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  Truck,
  ClipboardList,
  FileText,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Warehouse,
  ClipboardCheck,
  PackageCheck,
  Users,
  Box,
  Gauge,
  Scale,
  Barcode,
  QrCode,
  CalendarCheck,
  ClipboardSignature,
  Filter,
  MapPin
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import SubMenu from './SubMenu';

export interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  path: string;
  submenu?: SubMenuItem[];
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setActiveMenu('');
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? '' : menu);
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard />,
      path: '/dashboard'
    },
    {
      title: 'Inbound Operations',
      icon: <Truck />,
      submenu: [
        {
          title: 'ASN Management',
          path: '/inbound/asn'
        },
        {
          title: 'Receiving',
          path: '/inbound/receiving'
        }
      ]
    },
    {
      title: 'Outbound Operations',
      icon: <Package />,
      submenu: [
        {
          title: 'Order Processing',
          path: '/outbound/orders'
        },
        {
          title: 'Shipping',
          path: '/outbound/shipping'
        }
      ]
    },
    {
      title: 'Master Data',
      icon: <ClipboardList />,
      submenu: [
        {
          title: 'Supplier Management',
          path: '/supplier-management'
        },
        {
          title: 'Customer Management',
          path: '/customer-management'
        },
        {
          title: 'inventory-master',
          path: '/inventory-master'
        },

        {
          title: 'warehouse-master',
          path: 'warehouse-master'
        }

      ]
    },
    {
      title: 'Inventory',
      icon: <Box />,
      submenu: [
        {
          title: 'Stock Levels',
          path: '/inventory/stock'
        },
        {
          title: 'Products',
          path: '/inventory/products'
        }
      ]
    },
    {
      title: 'Reports',
      icon: <BarChart2 />,
      submenu: [
        {
          title: 'Inventory Reports',
          path: '/reports/inventory'
        },
        {
          title: 'Sales Reports',
          path: '/reports/sales'
        }
      ]
    },
    {
      title: 'Settings',
      icon: <Settings />,
      path: '/settings'
    }
  ];

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
      border-r border-slate-700/50 shadow-2xl z-10 transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-72'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Warehouse className="h-7 w-7 text-white" />
          </div>
          {!isCollapsed && (
            <div className="ml-4">
              <span className="text-xl font-bold text-white">WMS Pro</span>
              <p className="text-xs text-slate-400 mt-0.5">Warehouse Management</p>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-slate-400 hover:text-white"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.title}>
            <SidebarItem
              item={item}
              isCollapsed={isCollapsed}
              isActive={!!(
                activeMenu === item.title.toLowerCase() || 
                item.path === location.pathname ||
                item.submenu?.some(sub => 
                  sub.path === location.pathname ||
                  sub.submenu?.some(subSub => subSub.path === location.pathname)
                )
              )}
              onClick={() => {
                if (item.path) navigate(item.path);
                else if (item.submenu) handleMenuClick(item.title.toLowerCase());
              }}
            />
            {!isCollapsed && item.submenu && activeMenu === item.title.toLowerCase() && (
              <SubMenu 
                items={item.submenu}
                currentPath={location.pathname}
              />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;