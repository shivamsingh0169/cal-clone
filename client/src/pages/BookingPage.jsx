import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';
import { Clock, CheckCircle } from 'lucide-react';

const API_URL = 'https://cal-clone-backend.onrender.com/api';

export default function BookingPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [success, setSuccess] = useState(false);

  // 1. Fetch Event Info (e.g., "30 Min Meeting")
  useEffect(() => {
    axios.get(`${API_URL}/event-types/${slug}`)
      .then(res => setEvent(res.data))
      .catch(() => console.log('Event not found'));
  }, [slug]);

  // 2. Fetch Available Slots when Date changes
  useEffect(() => {
    if (!event) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    axios.get(`${API_URL}/slots?date=${dateStr}&slug=${slug}`)
      .then(res => setSlots(res.data));
  }, [date, event, slug]);

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/bookings`, {
        ...form,
        date: format(date, 'yyyy-MM-dd'),
        time: selectedTime,
        slug
      });
      setSuccess(true);
    } catch (err) {
      alert("Booking failed. Please try again.");
    }
  };

  if (success) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg border text-center max-w-md">
        <div className="flex justify-center mb-4 text-green-500"><CheckCircle size={48} /></div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-4">You are scheduled with Kumar Shivam.</p>
        <p className="font-semibold">{format(date, 'EEEE, MMMM d')} at {selectedTime}</p>
      </div>
    </div>
  );

  if (!event) return <div className="p-10 text-center">Loading Event...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col md:flex-row max-w-5xl w-full overflow-hidden">
        
        {/* LEFT: Event Details */}
        <div className="w-full md:w-1/3 p-8 border-r border-gray-200 bg-gray-50 md:bg-white">
          <p className="text-gray-500 font-medium mb-1">Kumar Shivam</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h1>
          <div className="flex items-center text-gray-500 mb-6">
            <Clock size={18} className="mr-2" />
            <span>{event.duration} min</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* MIDDLE: Calendar */}
        <div className="w-full md:w-1/3 p-6 border-r border-gray-200 flex flex-col items-center">
          <h3 className="font-semibold mb-6 text-gray-900">Select a Date</h3>
          <Calendar 
            onChange={setDate} 
            value={date} 
            minDate={new Date()}
            view="month"
            prev2Label={null}
            next2Label={null}
          />
        </div>

        {/* RIGHT: Time Slots & Form */}
        <div className="w-full md:w-1/3 p-6 h-[500px] overflow-y-auto">
          {!selectedTime ? (
            <>
              <h3 className="font-semibold mb-4 text-gray-900 text-center">
                {format(date, 'EEEE, MMM d')}
              </h3>
              <div className="flex flex-col gap-2">
                {slots.length === 0 && <p className="text-gray-400 text-center text-sm py-10">No availability.</p>}
                {slots.map(time => (
                  <button 
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className="w-full py-3 border border-blue-600 text-blue-600 font-bold rounded-md hover:bg-blue-50 transition-colors"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                type="button" 
                onClick={() => setSelectedTime(null)} 
                className="text-sm text-gray-500 hover:text-black mb-2 self-start"
              >
                ← Back
              </button>
              
              <div className="mb-2">
                <span className="text-gray-500 text-sm">Selected Time:</span>
                <h3 className="font-bold text-xl">{selectedTime}</h3>
                <p className="text-gray-500 text-sm">{format(date, 'EEEE, MMM d')}</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                <input 
                  type="text" required 
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" required 
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>

              <button className="bg-black text-white py-3 rounded-md font-bold mt-4 hover:bg-gray-800 transition-all">
                Confirm Booking
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}