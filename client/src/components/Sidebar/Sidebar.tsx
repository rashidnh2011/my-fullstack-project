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
    title: 'Inventory',
    icon: <Box />,
    submenu: [
      {
        title: 'Products',
        path: '/products'
      },
      {
        title: 'Stock Levels',
        path: '/stock'
      }
    ]
  },
  {
    title: 'Supplier Master',
    icon: <Users />,
    path: '/supplier-management'
  },
  // Add more items as needed...
];

  return (
    <div className={`h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out 
      ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Warehouse size={24} />
            <span className="font-bold text-lg">WMS Pro</span>
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-700"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
              isActive={activeMenu === item.title.toLowerCase() || 
                        item.path === location.pathname ||
                        item.submenu?.some(sub => 
                          sub.path === location.pathname ||
                          sub.submenu?.some(subSub => subSub.path === location.pathname)
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