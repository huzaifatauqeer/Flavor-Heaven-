import { Users, Archive, ChefHat, Tag } from 'lucide-react';

const stats = [
  { label: 'Total Staff', value: 5, icon: <Users className="text-gray-500" /> },
  {
    label: 'Food Items',
    value: 6,
    icon: <ChefHat className="text-orange-600" />,
  },
  { label: 'Active Deals', value: 3, icon: <Tag className="text-rose-400" /> },
  {
    label: 'Past Orders',
    value: 3,
    icon: <Archive className="text-emerald-500" />,
  },
];

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome to the dashboard! Here you can manage your restaurant's staff,
        food items, deals, and orders.
      </p>

      {/* Stat Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100
            transform transition duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
          >
            <div>
              <h4 className="text-gray-600 text-sm font-medium">
                {item.label}
              </h4>
              <p className="text-2xl font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
            <div className="text-3xl">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* System Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gray-50 p-6 ">
        {/* Text Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">System Overview</h2>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Manage Your Restaurant Efficiently
          </h3>
          <p className="text-gray-600 mb-3">
            This system helps you manage staff, food items, billing, and special
            deals all in one place. Navigate through the sections using the
            sidebar to get started.
          </p>
          <p className="text-sm text-gray-500">
            Remember, this is a frontend-only application. All data is managed
            locally in your browser and will reset on refresh if not persisted
            (though Redux state might persist for the session).
          </p>
        </div>

        {/* Image Section */}
        <div>
          <img
            src="src\assets\mche-lee-OmmEcNtYvps-unsplash.jpg"
            alt="Restaurant Overview"
            className="rounded-lg w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
