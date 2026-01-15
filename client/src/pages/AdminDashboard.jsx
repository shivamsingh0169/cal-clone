import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { ExternalLink, Calendar, User, Clock } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Load Bookings
    axios.get(`${API_URL}/admin/bookings`).then(res => setBookings(res.data));
    // Load Event Types
    axios.get(`${API_URL}/event-types`).then(res => setEvents(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your events and upcoming bookings.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border shadow-sm text-sm font-medium">
            Admin Mode
          </div>
        </header>

        {/* SECTION 1: Event Types */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} /> Event Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{event.duration} minutes • One-on-One</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">/{event.slug}</span>
                  <a 
                    href={`/${event.slug}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    View Page <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Upcoming Bookings */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} /> Upcoming Bookings
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="p-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="p-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                    <th className="p-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">No bookings yet.</td>
                    </tr>
                  ) : bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{format(parseISO(b.startTime), 'MMM d, yyyy')}</div>
                        <div className="text-gray-500 text-sm">
                          {format(parseISO(b.startTime), 'h:mm a')} - {format(parseISO(b.endTime), 'h:mm a')}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {b.attendeeName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{b.attendeeName}</div>
                            <div className="text-gray-500 text-sm">{b.attendeeEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">{b.eventType.title}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}