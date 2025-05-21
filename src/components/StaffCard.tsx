import React from 'react';

type Staff = {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
};

type StaffCardProps = {
  staff: Staff;
  onEdit: (staff: Staff) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
};

const StaffCard: React.FC<StaffCardProps> = ({ staff, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div
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
          onClick={() => onEdit(staff)}
          className="text-sm px-3 py-1 rounded-lg border border-orange-600 text-orange-600
            hover:bg-orange-50 active:bg-orange-500 active:text-white transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onToggleStatus(staff.id)}
          className={`text-sm px-3 py-1 rounded-lg border ${
            staff.status === 'Active'
              ? 'border-orange-500 text-orange-500 hover:bg-red-50 active:bg-orange-500 active:text-white'
              : 'border-green-500 text-green-500 hover:bg-green-50 active:bg-orange-500 active:text-white'
          } transition-colors duration-200`}
        >
          {staff.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={() => onDelete(staff.id)}
          className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600
            active:bg-orange-500 active:text-white transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default StaffCard;
