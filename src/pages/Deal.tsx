import { useState, useEffect } from 'react';
import dealsData from '../data/deals.json';
import { Tag, Calendar, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Deal = {
  id: string;
  title: string;
  items_included: string[];
  deal_price: number;
  regular_price: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  description: string;
};

const itemsMap: Record<string, string> = {
  f1: 'Chicken Biryani',
  f2: 'Beef Burger',
  f3: 'French Fries',
  f4: 'Chocolate Cake',
  f5: 'Mango Shake',
  f7: 'Karahi',
  f8: 'Mint Lemonade',
};

const menuItemsOptions = Object.entries(itemsMap).map(([key, label]) => ({
  key,
  label,
}));

const calculateDiscountPercentage = (regular: number, deal: number) => {
  return Math.round(((regular - deal) / regular) * 100);
};

const formatDateRange = (start: string, end: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const startDate = new Date(start).toLocaleDateString(undefined, options);
  const endDate = new Date(end).toLocaleDateString(undefined, options);
  return `${startDate} - ${endDate}`;
};

const generateId = () => Math.random().toString(36).slice(2, 9);

const DealsPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);

  const [newDeal, setNewDeal] = useState<Omit<Deal, 'id'>>({
    title: '',
    items_included: [],
    deal_price: 0,
    regular_price: 0,
    start_date: '',
    end_date: '',
    is_active: true,
    description: '',
  });

  useEffect(() => {
    setDeals(dealsData);
  }, []);

  const refreshDeals = () => {
    setDeals(dealsData);
    setSearch('');
    setFilterActive('all');
  };

  const handleEditOpen = (deal: Deal) => {
    setSelectedDeal({ ...deal });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedDeal(null);
  };

  const handleEditSave = () => {
    if (selectedDeal) {
      setDeals((prev) =>
        prev.map((d) => (d.id === selectedDeal.id ? selectedDeal : d))
      );
      toast.success('Deal updated successfully!');
      handleEditClose();
    }
  };

  const handleToggleStatus = (id: string) => {
    setDeals((prevDeals) =>
      prevDeals.map((deal) => {
        if (deal.id === id) {
          const toggledDeal = { ...deal, is_active: !deal.is_active };
          toast.success(
            `${toggledDeal.title} is now ${
              toggledDeal.is_active ? 'Active' : 'Inactive'
            }`
          );
          return toggledDeal;
        }
        return deal;
      })
    );
  };

  const handleCreateOpen = () => {
    setOpenCreate(true);
  };

  const handleCreateClose = () => {
    setOpenCreate(false);
    setNewDeal({
      title: '',
      items_included: [],
      deal_price: 0,
      regular_price: 0,
      start_date: '',
      end_date: '',
      is_active: true,
      description: '',
    });
  };

  const handleCreateChange = (field: keyof Omit<Deal, 'id'>, value: any) => {
    setNewDeal((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSave = () => {
    if (
      !newDeal.title.trim() ||
      !newDeal.start_date ||
      !newDeal.end_date ||
      newDeal.regular_price <= 0 ||
      newDeal.deal_price <= 0
    ) {
      toast.error('Please fill all required fields with valid values.');
      return;
    }

    const createdDeal: Deal = {
      id: generateId(),
      ...newDeal,
    };

    setDeals((prev) => [createdDeal, ...prev]);
    toast.success('New deal created successfully!');
    handleCreateClose();
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = deal.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && deal.is_active) ||
      (filterActive === 'inactive' && !deal.is_active);
    return matchesSearch && matchesFilter;
  });

  const handleDeleteClick = (deal: Deal) => {
    setDealToDelete(deal);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (!dealToDelete) return;

    setDeals((prev) => prev.filter((d) => d.id !== dealToDelete.id));
    toast.success(`"${dealToDelete.title}" deleted successfully.`);
    setOpenDelete(false);
    setDealToDelete(null);
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setDealToDelete(null);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            🎉 Deals & Offers
          </h1>
          <button
            className="self-start md:self-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-md hover:from-orange-600 hover:to-orange-700 transition"
            onClick={handleCreateOpen}
          >
            ➕ Create New Deal
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex items-center flex-grow border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-rose-700">
            <input
              type="text"
              placeholder="🔍 Search deals..."
              className="flex-grow px-4 py-2 rounded-l-md focus:outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={refreshDeals}
              className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-md transition"
              aria-label="Refresh deals"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-700 text-sm"
            value={filterActive}
            onChange={(e) =>
              setFilterActive(e.target.value as 'all' | 'active' | 'inactive')
            }
          >
            <option value="all">All Deals</option>
            <option value="active">Active Deals</option>
            <option value="inactive">Inactive Deals</option>
          </select>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredDeals.map((deal) => {
            const discountPercent = calculateDiscountPercentage(
              deal.regular_price,
              deal.deal_price
            );

            return (
              <div
                key={deal.id}
                className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 border border-gray-100"
              >
                {/* Title */}
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="text-orange-500 w-5 h-5" />
                  <h2 className="font-semibold text-lg text-gray-800">
                    {deal.title}
                  </h2>
                </div>

                {/* Status */}
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    deal.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {deal.is_active ? 'Active' : 'Inactive'}
                </span>

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateRange(deal.start_date, deal.end_date)}</span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                  {deal.description}
                </p>

                {/* Included Items */}
                <div className="bg-gray-50 rounded-md p-3 mb-4">
                  <strong className="block mb-1 text-gray-800 text-sm">
                    Included Items:
                  </strong>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {deal.items_included.map((itemId, idx) => (
                      <li key={idx}>{itemsMap[itemId] || 'Unknown Item'}</li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <div>
                    <span className="block">Regular Price</span>
                    <span className="line-through font-medium">
                      Rs {deal.regular_price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-green-700 font-bold text-lg">
                    <span className="block">Deal Price</span>
                    <span>Rs {deal.deal_price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditOpen(deal)}
                    className="flex-1 border border-orange-600 text-orange-700 py-2 rounded-md text-sm hover:bg-rose-50 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-md text-sm hover:from-orange-600 hover:to-orange-700 transition"
                    onClick={() => handleToggleStatus(deal.id)}
                  >
                    {deal.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="flex-1  bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 rounded-md text-sm transition"
                    onClick={() => handleDeleteClick(deal)}
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* Discount Badge */}
                <div
                  className="absolute -top-4 right-4 w-14 h-14 rounded-full bg-amber-400 flex flex-col items-center justify-center text-white font-bold shadow-md"
                  style={{ fontSize: '0.8rem' }}
                >
                  <span className="text-xs">Save</span>
                  <span>{discountPercent}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={openEdit}
          onClose={handleEditClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="pb-0">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Deal</h2>
          </DialogTitle>

          <DialogContent>
            <div className="flex flex-col gap-4 py-4 px-1 sm:px-2">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedDeal?.title || ''}
                  onChange={(e) =>
                    setSelectedDeal(
                      (prev) => prev && { ...prev, title: e.target.value }
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={selectedDeal?.description || ''}
                  onChange={(e) =>
                    setSelectedDeal(
                      (prev) => prev && { ...prev, description: e.target.value }
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                />
              </div>

              {/* Included Items */}
              <FormControl fullWidth size="small" className="mb-4">
                <InputLabel id="edit-included-items-label">
                  Included Items
                </InputLabel>
                <Select
                  labelId="edit-included-items-label"
                  multiple
                  value={selectedDeal?.items_included || []}
                  onChange={(e) => {
                    const value = e.target.value as string[];
                    setSelectedDeal(
                      (prev) => prev && { ...prev, items_included: value }
                    );
                  }}
                  input={<OutlinedInput label="Included Items" />}
                  renderValue={(selected) =>
                    (selected as string[])
                      .map((val) => itemsMap[val] || val)
                      .join(', ')
                  }
                >
                  {menuItemsOptions.map((item) => (
                    <MenuItem key={item.key} value={item.key}>
                      <Checkbox
                        checked={
                          (selectedDeal?.items_included ?? []).indexOf(
                            item.key
                          ) > -1
                        }
                      />
                      <ListItemText primary={item.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Price Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Price
                  </label>
                  <input
                    type="number"
                    value={selectedDeal?.deal_price || ''}
                    onChange={(e) =>
                      setSelectedDeal(
                        (prev) =>
                          prev && { ...prev, deal_price: +e.target.value }
                      )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Price
                  </label>
                  <input
                    type="number"
                    value={selectedDeal?.regular_price || ''}
                    onChange={(e) =>
                      setSelectedDeal(
                        (prev) =>
                          prev && { ...prev, regular_price: +e.target.value }
                      )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={selectedDeal?.start_date || ''}
                    onChange={(e) =>
                      setSelectedDeal(
                        (prev) =>
                          prev && { ...prev, start_date: e.target.value }
                      )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={selectedDeal?.end_date || ''}
                    onChange={(e) =>
                      setSelectedDeal(
                        (prev) => prev && { ...prev, end_date: e.target.value }
                      )
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </DialogContent>

          <DialogActions className="px-6 pb-4">
            <div className="w-full flex justify-between">
              <button
                onClick={handleEditClose}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700"
              >
                Save Changes
              </button>
            </div>
          </DialogActions>
        </Dialog>

        {/* Create New Deal Dialog */}
        <Dialog
          open={openCreate}
          onClose={handleCreateClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="pb-0">
            <h2 className="text-2xl font-semibold text-gray-800">
              Create New Deal
            </h2>
          </DialogTitle>

          <DialogContent>
            <div className="flex flex-col gap-4 py-4 px-1 sm:px-2">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newDeal.title}
                  onChange={(e) => handleCreateChange('title', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDeal.description}
                  onChange={(e) =>
                    handleCreateChange('description', e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                />
              </div>

              {/* Included Items */}
              <FormControl fullWidth size="small" className="mb-4">
                <InputLabel id="included-items-label">
                  Included Items
                </InputLabel>
                <Select
                  labelId="included-items-label"
                  multiple
                  value={newDeal.items_included}
                  onChange={(e) =>
                    handleCreateChange(
                      'items_included',
                      e.target.value as string[]
                    )
                  }
                  input={<OutlinedInput label="Included Items" />}
                  renderValue={(selected) =>
                    (selected as string[])
                      .map((val) => itemsMap[val] || val)
                      .join(', ')
                  }
                >
                  {menuItemsOptions.map((item) => (
                    <MenuItem key={item.key} value={item.key}>
                      <Checkbox
                        checked={newDeal.items_included.indexOf(item.key) > -1}
                      />
                      <ListItemText primary={item.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Price Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Price *
                  </label>
                  <input
                    type="number"
                    value={newDeal.deal_price}
                    onChange={(e) =>
                      handleCreateChange('deal_price', +e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Price *
                  </label>
                  <input
                    type="number"
                    value={newDeal.regular_price}
                    onChange={(e) =>
                      handleCreateChange('regular_price', +e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={newDeal.start_date}
                    onChange={(e) =>
                      handleCreateChange('start_date', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={newDeal.end_date}
                    onChange={(e) =>
                      handleCreateChange('end_date', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </DialogContent>

          <DialogActions className="px-6 pb-4">
            <div className="w-full flex justify-between">
              <button
                onClick={handleCreateClose}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSave}
                className="px-4 py-2 text-sm rounded-md bg-rose-600 text-white hover:bg-rose-700"
              >
                Create Deal
              </button>
            </div>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDelete}
          onClose={handleDeleteCancel}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: 16,
              padding: '1.5rem 1.75rem',
              backgroundColor: '#fff',
            },
          }}
        >
          <DialogTitle className="pb-3">
            <h2 className="text-2xl font-extrabold text-orange-600 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 13h6m2 8H7a2 2 0 01-2-2V7h14v12a2 2 0 01-2 2z"
                />
              </svg>
              Confirm Delete
            </h2>
          </DialogTitle>

          <DialogContent>
            <p className="text-gray-800 mt-1 text-base leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-orange-600">
                "{dealToDelete?.title}"
              </span>
              ? This action cannot be undone.
            </p>
          </DialogContent>

          <DialogActions className="pt-6 px-0 justify-end gap-3">
            <Button
              onClick={handleDeleteCancel}
              variant="outlined"
              className="capitalize font-medium"
              style={{
                minWidth: 110,
                borderColor: '#ffa726',
                color: '#ffa726',
                padding: '8px 20px',
                borderRadius: 8,
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffa726';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#ffa726';
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteConfirm}
              className="min-w-[110px] capitalize font-semibold"
              style={{
                background: 'linear-gradient(90deg, #fb8c00, #ef6c00)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(239, 108, 0, 0.4)',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(90deg, #ef6c00, #d84315)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(90deg, #fb8c00, #ef6c00)';
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default DealsPage;
