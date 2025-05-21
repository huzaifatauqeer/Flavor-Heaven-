import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

type FoodItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  is_available: boolean;
  description: string;
};

type Props = {
  item: FoodItem;
  onUpdate: (item: FoodItem) => void;
};

const categories = ['Main Course', 'Starter', 'Dessert', 'Drinks'];

const FoodItemCard: React.FC<Props> = ({ item, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleEditOpen = () => {
    setEditedItem(item);
    setOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(editedItem);
    toast.success('Item updated!');
    setOpen(false);
  };

  const handleToggleAvailability = () => {
    const updated = { ...item, is_available: !item.is_available };
    onUpdate(updated);
    toast.success(
      updated.is_available ? 'Marked as Available' : 'Marked as Unavailable'
    );
  };

  return (
    <>
      {/* === Card === */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {item.is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full inline-block mb-2">
          {item.category}
        </span>
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        <p className="text-orange-700 font-bold text-lg">Rs. {item.price}</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleEditOpen}
            className="flex border border-orange-600 text-orange-600 hover:bg-orange-50 px-3 py-2 transition-all text-sm rounded-lg"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleToggleAvailability}
            className={`flex-1 ${
              item.is_available ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white px-4 py-2 text-sm rounded-lg transition`}
          >
            {item.is_available ? '🚫 Mark Unavailable' : '✅ Mark Available'}
          </button>
        </div>
      </div>

      {/* === Modal === */}
      {open && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.1)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Food Item</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedItem.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={editedItem.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editedItem.price}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editedItem.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm rounded-md border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodItemCard;
