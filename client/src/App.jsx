import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      {/* --- START: RENDER COLD START WARNING --- */}
      <div className="bg-blue-50 border-b border-blue-200 text-blue-800 px-4 py-3 text-center text-sm">
        <span className="font-bold">⚠️ Notice: </span>
        Wait for 1 minute if data doesn't load immediately. The backend is hosted on Render's free tier and needs time to "wake up".
      </div>
      {/* --- END: WARNING --- */}

      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/:slug" element={<BookingPage />} />
        <Route path="/" element={<div className="p-10 text-center"><a href="/admin" className="text-blue-600 underline">Go to Admin Dashboard</a></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;