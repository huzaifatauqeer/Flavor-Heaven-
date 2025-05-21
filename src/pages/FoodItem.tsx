import React, { useState } from 'react';
import foodData from '../data/foodItems.json';
import FoodItemCard from '../components/FoodCard';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-hot-toast';

const categories = ['Main Course', 'Starter', 'Dessert', 'Drinks'];

type FoodItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  is_available: boolean;
  description: string;
};

const FoodItemsPage: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>(foodData);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const [openAdd, setOpenAdd] = useState(false);
  const [newItem, setNewItem] = useState<FoodItem>({
    id: '',
    name: '',
    category: 'Main Course',
    price: 0,
    is_available: true,
    description: '',
  });

  const handleUpdate = (updatedItem: FoodItem) => {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
  };

  const handleAddNew = () => {
    if (!newItem.name || !newItem.description) {
      toast.error('Please fill out all required fields.');
      return;
    }

    const newItemWithId = { ...newItem, id: `f${Date.now()}` };
    setItems([newItemWithId, ...items]);
    setOpenAdd(false);
    setNewItem({
      id: '',
      name: '',
      category: 'Main Course',
      price: 0,
      is_available: true,
      description: '',
    });
    toast.success('Item added!');
  };

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Food Items</h1>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          ➕ Add New Item
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search food items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pink-500"
        >
          <option>All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={() => window.location.reload()}
          className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Food Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <FoodItemCard key={item.id} item={item} onUpdate={handleUpdate} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No food items found.</p>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm" PaperProps={{ className: 'rounded-xl p-6' }}>
        <DialogTitle className="text-2xl font-semibold text-gray-800 mb-4">Add Food Item</DialogTitle>
        <DialogContent className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Chicken Biryani"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: +e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 450"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="e.g., Flavorful rice dish cooked with spices..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isAvailable"
              type="checkbox"
              checked={newItem.is_available}
              onChange={(e) => setNewItem({ ...newItem, is_available: e.target.checked })}
              className="accent-orange-600"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-700">Available</label>
          </div>
        </DialogContent>
        <DialogActions className="mt-6 px-6 pb-4 flex justify-end gap-3">
          <button
            onClick={() => setOpenAdd(false)}
            className="px-4 py-2 text-sm rounded-md border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700"
          >
            Add Item
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FoodItemsPage;
