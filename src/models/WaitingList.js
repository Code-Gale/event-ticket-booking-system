const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const WaitingList = mongoose.model('WaitingList', waitingListSchema);
module.exports = WaitingList;
