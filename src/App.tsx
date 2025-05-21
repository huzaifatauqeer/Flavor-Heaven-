import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Staff from './pages/Staff';
import Foods from './pages/FoodItem';
import Deals from './pages/Deal';
import Billing from './pages/Billing';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="staff" element={<Staff />} />
          <Route path="food" element={<Foods />} />
          <Route path="deals" element={<Deals />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
