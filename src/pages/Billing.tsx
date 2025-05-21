import React, { useState } from 'react';
import foodItems from '../data/foodItems.json';
import { pdf } from '@react-pdf/renderer';
import Invoice from '../components/Invoice';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  is_available: boolean;
}

interface BillItem extends FoodItem {
  quantity: number;
}

const Billing: React.FC = () => {
  const [bill, setBill] = useState<BillItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const addToBill = (item: FoodItem) => {
    setBill((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const clearBill = () => setBill([]);

  const taxRate = paymentMethod === 'cash' ? 0.15 : 0.05;
  const subtotal = bill.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const currentDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  const downloadInvoice = async () => {
    const blob = await pdf(
      <Invoice
        hotelName="Royal Food Point"
        date={currentDate}
        items={bill}
        subtotal={subtotal}
        tax={tax}
        total={total}
        paymentMethod={paymentMethod}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${currentDate}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans ">
      <h1 className="text-4xl font-bold text-gray-800 mb-1">
        Billing System
      </h1>
      <p className="text-gray-500 mb-6 text-lg">
        Create and manage customer bills with ease
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu Items Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 max-h-[75vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            📋 Menu Items
          </h2>
          {foodItems.map((item) =>
            item.is_available ? (
              <div
                key={item.id}
                className="flex justify-between items-center py-4 border-b last:border-none"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                  <p className="text-orange-600 font-semibold text-sm">
                    Rs. {item.price}
                  </p>
                </div>
                <button
                  onClick={() => addToBill(item)}
                  className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-1 rounded-lg transition-all shadow-sm"
                >
                  ➕ Add
                </button>
              </div>
            ) : null
          )}
        </div>

        {/* Current Bill Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                🛍️ Current Bill
              </h2>
              <button
                onClick={clearBill}
                className="text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-100 transition"
              >
                🧹 Clear
              </button>
            </div>

            <ul className="mb-4 divide-y divide-gray-200">
              {bill.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between py-3 items-center"
                >
                  <div>
                    <h4 className="text-gray-800 font-medium">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          setBill((prev) =>
                            prev
                              .map((i) =>
                                i.id === item.id
                                  ? { ...i, quantity: i.quantity - 1 }
                                  : i
                              )
                              .filter((i) => i.quantity > 0)
                          )
                        }
                        className="bg-gray-200 text-gray-700 px-2 rounded hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="text-sm text-gray-600">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          setBill((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                            )
                          )
                        }
                        className="bg-gray-200 text-gray-700 px-2 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-gray-700 font-semibold">
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Payment Method */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-600">
                Payment Method:
              </h4>
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`px-5 py-2 rounded-lg text-sm transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'border border-gray-300 text-gray-700'
                  }`}
                >
                  💵 Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`px-5 py-2 rounded-lg text-sm transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'border border-gray-300 text-gray-700'
                  }`}
                >
                  💳 Card
                </button>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Subtotal:</span>
              <span>Rs. {subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Tax ({paymentMethod === 'cash' ? '15%' : '5%'}):</span>
              <span>Rs. {tax.toFixed(0)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total:</span>
              <span>Rs. {total.toFixed(0)}</span>
            </div>

            <button
              onClick={downloadInvoice}
              disabled={bill.length === 0}
              className="mt-6 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl text-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✅ Complete Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
