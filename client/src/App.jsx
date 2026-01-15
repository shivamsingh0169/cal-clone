import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/:slug" element={<BookingPage />} />
        <Route path="/" element={<div className="p-10 text-center"><a href="/admin" className="text-blue-600 underline">Go to Admin Dashboard</a></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;