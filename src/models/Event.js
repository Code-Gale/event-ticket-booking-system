const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
    min: 1,
  },
  availableTickets: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
