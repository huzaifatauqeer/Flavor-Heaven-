import { NavLink, Outlet } from 'react-router-dom';
import { ChefHat, Users, Coffee, Receipt, Tag, Menu, X } from 'lucide-react';
import { useState } from 'react';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Mobile toggle button */}
      <button
        type="button"
        className="p-2 m-2 text-gray-500 rounded-md md:hidden fixed top-0 left-0 z-20 bg-white shadow-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 bg-white p-4 shadow-lg transition-all duration-300 transform fixed inset-y-0 left-0 z-10 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col justify-between h-full overflow-y-auto">
          {/* Header */}
          <div>
            <div className="flex items-center mb-8 pt-2">
              <ChefHat size={32} className="text-orange-600" />
              <h1 className="ml-2 text-xl font-serif font-bold text-orange-600">
                Flavor Haven
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col space-y-2 text-md font-medium">
              <NavItem to="/" icon={<Coffee size={22} />} label="Dashboard" />
              <NavItem to="/staff" icon={<Users size={22} />} label="Staff" />
              <NavItem to="/food" icon={<ChefHat size={22} />} label="Food Items" />
              <NavItem to="/billing" icon={<Receipt size={22} />} label="Billing" />
              <NavItem to="/deals" icon={<Tag size={22} />} label="Deals & Offers" />
            </nav>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-opacity-30 z-0 md:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

// Reusable NavItem
function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
          isActive
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default Layout;
