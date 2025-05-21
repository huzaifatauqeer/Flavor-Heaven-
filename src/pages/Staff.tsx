import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

type Staff = {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
};

const initialData: Staff[] = [
  { id: 's1', name: 'Ali Khan', role: 'Chef', status: 'Active' },
  { id: 's2', name: 'Sarah Ahmed', role: 'Waiter', status: 'Active' },
  { id: 's3', name: 'Zain Malik', role: 'Manager', status: 'Active' },
  { id: 's4', name: 'Ayesha Imran', role: 'Cashier', status: 'Inactive' },
  { id: 's5', name: 'Bilal Hassan', role: 'Chef', status: 'Active' },
  { id: 's6', name: 'Fatima Zahra', role: 'Waiter', status: 'Inactive' },
  { id: 's7', name: 'Omar Farooq', role: 'Cleaner', status: 'Active' },
  { id: 's8', name: 'Nadia Khan', role: 'Host', status: 'Active' },
];

const StaffManagement = () => {
  const [staffList, setStaffList] = useState<Staff[]>(initialData);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const roles = ['All Roles', ...Array.from(new Set(initialData.map((s) => s.role)))];
  const statuses = ['Status', 'Active', 'Inactive'];

  const filteredStaff = staffList.filter((staff) => {
    const matchesName = staff.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === 'All Roles' || staff.role === role;
    const matchesStatus = statusFilter === 'Status' || staff.status === statusFilter;
    return matchesName && matchesRole && matchesStatus;
  });

  const toggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
      )
    );
    toast.success('Staff status updated!');
  };

  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    setDeleteTargetId(null);
    toast.error('Staff member deleted!');
  };

  const saveEdit = () => {
    if (editingStaff) {
      setStaffList((prev) =>
        prev.map((s) => (s.id === editingStaff.id ? editingStaff : s))
      );
      setEditingStaff(null);
      toast.success('Staff member updated!');
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Staff>({
    id: '',
    name: '',
    role: roles[1] || 'Chef',
    status: 'Active',
  });

  const generateId = () => `s${Date.now().toString()}`;

  const handleAddStaff = () => {
    if (!newStaff.name.trim()) {
      toast.error('Name is required!');
      return;
    }
    const newEntry = { ...newStaff, id: generateId() };
    setStaffList((prev) => [...prev, newEntry]);
    setIsAddDialogOpen(false);
    toast.success('New staff added!');
    setNewStaff({
      id: '',
      name: '',
      role: roles[1] || 'Chef',
      status: 'Active',
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <Toaster position="top-right" />
      <div className="min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Staff Members</h1>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            ➕ Add New Staff
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={refreshPage}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Edit Dialog */}
        <Dialog open={Boolean(editingStaff)} onClose={() => setEditingStaff(null)}>
          <DialogContent>
            {editingStaff && (
              <div className="bg-white p-6 rounded-xl mb-8">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
                  {editingStaff.name}
                </h2>
                <h3 className="text-xl font-bold text-orange-700 mb-4">Edit Staff</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Name</label>
                    <input
                      className="p-3 border border-gray-300 rounded-lg w-full"
                      value={editingStaff.name}
                      onChange={(e) =>
                        setEditingStaff({ ...editingStaff, name: e.target.value })
                      }
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Role</label>
                    <select
                      className="p-3 border border-gray-300 rounded-lg w-full"
                      value={editingStaff.role}
                      onChange={(e) =>
                        setEditingStaff({ ...editingStaff, role: e.target.value })
                      }
                    >
                      {roles
                        .filter((r) => r !== 'All Roles')
                        .map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Status</label>
                    <select
                      className="p-1 border border-gray-300 rounded-lg w-full"
                      value={editingStaff.status}
                      onChange={(e) =>
                        setEditingStaff({
                          ...editingStaff,
                          status: e.target.value as 'Active' | 'Inactive',
                        })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-lg"
                    onClick={saveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg"
                    onClick={() => setEditingStaff(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={Boolean(deleteTargetId)} onClose={() => setDeleteTargetId(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <p className="mb-4">Are you sure you want to delete this staff member?</p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteTargetId && deleteStaff(deleteTargetId)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg
                  active:bg-orange-500 active:text-white transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteTargetId(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg
                  active:bg-orange-500 active:text-white transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
          <DialogTitle>Add New Staff</DialogTitle>
          <DialogContent>
            <div className="bg-white p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Name</label>
                  <input
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    placeholder="Name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Role</label>
                  <select
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  >
                    {roles
                      .filter((r) => r !== 'All Roles')
                      .map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Status</label>
                  <select
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    value={newStaff.status}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, status: e.target.value as 'Active' | 'Inactive' })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-lg"
                  onClick={handleAddStaff}
                >
                  Add
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Staff Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col gap-4"
            >
              <div>
                <p className="text-lg font-semibold text-gray-900">{staff.name}</p>
                <p className="text-orange-600 font-semibold">{staff.role}</p>
              </div>
              <div
                className={`inline-block rounded-lg px-2 py-0.5 text-sm font-semibold ${
                  staff.status === 'Active'
                    ? 'bg-green-200 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {staff.status}
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => setEditingStaff(staff)}
                  className="text-sm px-3 py-1 rounded-lg border border-orange-600 text-orange-600
                    hover:bg-orange-50
                    active:bg-orange-500 active:text-white transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(staff.id)}
                  className={`text-sm px-3 py-1 rounded-lg border
                    ${
                      staff.status === 'Active'
                        ? 'border-orange-500 text-orange-500 hover:bg-red-50 active:bg-orange-500 active:text-white'
                        : 'border-green-500 text-green-500 hover:bg-green-50 active:bg-orange-500 active:text-white'
                    }
                    transition-colors duration-200`}
                >
                  {staff.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => setDeleteTargetId(staff.id)}
                  className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600
                    active:bg-orange-500 active:text-white transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
