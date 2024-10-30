const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const WaitingList = require('../models/WaitingList');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await Event.deleteMany({});
  await Booking.deleteMany({});
  await WaitingList.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /api/events/initialize', () => {
  it('should initialize an event with available tickets', async () => {
    const response = await request(app)
      .post('/api/events/initialize')
      .send({ name: 'Concert', totalTickets: 100 });
    expect(response.statusCode).toBe(201);
    expect(response.body.event).toHaveProperty('name', 'Concert');
    expect(response.body.event).toHaveProperty('availableTickets', 100);
  });
});

describe('POST /api/events/book', () => {
  it('should book a ticket if available', async () => {
    const event = await Event.findOne({ name: 'Concert' });
    const response = await request(app)
      .post('/api/events/book')
      .send({ user: 'user123', eventId: event._id });
    expect(response.statusCode).toBe(201);
    expect(response.body.booking).toHaveProperty('status', 'confirmed');
  });
});

describe('POST /api/events/cancel', () => {
  it('should cancel a booking and make ticket available', async () => {
    const event = await Event.findOne({ name: 'Concert' });
    const response = await request(app)
      .post('/api/events/cancel')
      .send({ user: 'user123', eventId: event._id });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('canceledBooking');
  });
});

describe('GET /api/events/status/:eventId', () => {
  it('should return the event status with available tickets and waiting list count', async () => {
    const event = await Event.findOne({ name: 'Concert' });
    const response = await request(app).get(`/api/events/status/${event._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('availableTickets');
    expect(response.body).toHaveProperty('waitingListCount');
  });
});
