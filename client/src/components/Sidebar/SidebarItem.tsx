import { MenuItem } from './Sidebar';

interface SidebarItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({ item, isCollapsed, isActive, onClick }: SidebarItemProps) => {
  return (
    <div
      className={`flex items-center p-3 mx-2 rounded-md cursor-pointer transition-colors
        ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="flex-shrink-0">
        {item.icon}
      </div>
      {!isCollapsed && (
        <span className="ml-3 overflow-hidden whitespace-nowrap">
          {item.title}
        </span>
      )}
    </div>
  );
};

export default SidebarItem;