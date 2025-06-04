import { useNavigate } from 'react-router-dom';
import { SubMenuItem } from './Sidebar';

interface SubMenuProps {
  items: SubMenuItem[];
  currentPath: string;
}

const SubMenu = ({ items, currentPath }: SubMenuProps) => {
  const navigate = useNavigate();

  return (
    <div className="ml-8 my-1 space-y-1">
      {items.map((item) => (
        <div
          key={item.path}
          className={`p-2 pl-4 rounded-md cursor-pointer text-sm
            ${currentPath === item.path ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
          onClick={() => navigate(item.path)}
          aria-current={currentPath === item.path ? 'page' : undefined}
        >
          {item.title}
          {item.submenu && (
            <div className="ml-4 mt-1 space-y-1">
              {item.submenu.map((subItem) => (
                <div
                  key={subItem.path}
                  className={`p-2 rounded-md cursor-pointer
                    ${currentPath === subItem.path ? 'bg-blue-800' : 'hover:bg-gray-600'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(subItem.path);
                  }}
                  aria-current={currentPath === subItem.path ? 'page' : undefined}
                >
                  {subItem.title}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubMenu;