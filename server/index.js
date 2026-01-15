require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { addMinutes, format, parseISO, startOfDay, endOfDay } = require('date-fns');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// HARDCODED USER ID (Since we have no login system)
const ADMIN_ID = 1;

// --- ROUTE 1: Get All Event Types (For Dashboard) ---
app.get('/api/event-types', async (req, res) => {
  try {
    const events = await prisma.eventType.findMany({ where: { userId: ADMIN_ID } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// --- ROUTE 2: Get Single Event (For Booking Page) ---
app.get('/api/event-types/:slug', async (req, res) => {
  const event = await prisma.eventType.findFirst({
    where: { userId: ADMIN_ID, slug: req.params.slug }
  });
  res.json(event || {});
});

// --- ROUTE 3: Get Available Slots (CORE LOGIC) ---
app.get('/api/slots', async (req, res) => {
  const { date, slug } = req.query; // Expects "2026-01-20"
  
  // 1. Get Event Config
  const event = await prisma.eventType.findFirst({ where: { userId: ADMIN_ID, slug } });
  if (!event) return res.json([]);

  // 2. Get Availability Rules
  const dateObj = parseISO(date);
  const availability = await prisma.availability.findFirst({
    where: { userId: ADMIN_ID, dayOfWeek: dateObj.getDay() }
  });

  if (!availability) return res.json([]); // No work today

  // 3. Get Existing Bookings (Conflicts)
  const bookings = await prisma.booking.findMany({
    where: {
      userId: ADMIN_ID,
      startTime: {
        gte: startOfDay(dateObj),
        lte: endOfDay(dateObj)
      }
    }
  });

  // 4. Calculate Slots
  let slots = [];
  const [startH, startM] = availability.startTime.split(':').map(Number);
  const [endH, endM] = availability.endTime.split(':').map(Number);
  
  let currentMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;

  while (currentMins <= endMins - event.duration) {
    const slotStart = addMinutes(startOfDay(dateObj), currentMins);
    const slotEnd = addMinutes(slotStart, event.duration);

    // Conflict Check
    const isTaken = bookings.some(b => {
      return (b.startTime < slotEnd && b.endTime > slotStart);
    });

    if (!isTaken) {
      slots.push(format(slotStart, 'HH:mm'));
    }

    currentMins += event.duration;
  }
  
  res.json(slots);
});

// --- ROUTE 4: Create Booking ---
app.post('/api/bookings', async (req, res) => {
  const { name, email, date, time, slug } = req.body;
  
  const event = await prisma.eventType.findFirst({ where: { userId: ADMIN_ID, slug } });
  
  const [h, m] = time.split(':').map(Number);
  const startTime = addMinutes(startOfDay(parseISO(date)), h * 60 + m);
  const endTime = addMinutes(startTime, event.duration);

  // Save to DB
  await prisma.booking.create({
    data: {
      userId: ADMIN_ID,
      eventTypeId: event.id,
      startTime,
      endTime,
      attendeeName: name,
      attendeeEmail: email
    }
  });

  res.json({ success: true });
});

// --- ROUTE 5: Admin Dashboard Data ---
app.get('/api/admin/bookings', async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: ADMIN_ID },
    include: { eventType: true },
    orderBy: { startTime: 'desc' }
  });
  res.json(bookings);
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
