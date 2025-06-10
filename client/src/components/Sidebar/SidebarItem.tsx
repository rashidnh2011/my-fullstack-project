import { useNavigate, useLocation } from 'react-router-dom';

import { MenuItem } from './Sidebar';

interface SidebarItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  isActive,
  onClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isCurrentPath = location.pathname === item.path;

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center mx-3 mb-2 rounded-xl text-left transition-all duration-200
        group relative overflow-hidden
        ${isCurrentPath || isActive
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
        }
        ${isCollapsed ? 'justify-center p-3' : 'justify-start px-4 py-3'}
      `}
    >
      {/* Background glow effect for active items */}
      {(isCurrentPath || isActive) && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 blur-xl" />
      )}

      <span className={`relative z-10 ${isCurrentPath || isActive ? 'text-white' : ''}`}>
        {item.icon}
      </span>
      {!isCollapsed && (
        <span className="ml-3 font-medium relative z-10">{item.title}</span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg 
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                       whitespace-nowrap z-50 shadow-xl border border-slate-600">
          {item.title}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 
                         w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
        </div>
      )}
    </button>
  );
};

export default SidebarItem;