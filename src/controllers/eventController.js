const Event = require("../models/Event");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const WaitingList = require("../models/WaitingList");

// Initialize a new event
const initializeEvent = async (req, res) => {
  try {
    const { name, totalTickets } = req.body;

    if (totalTickets <= 0) {
      return res
        .status(400)
        .json({ error: "Total tickets must be greater than zero." });
    }

    // Create the new event
    const event = new Event({
      name,
      totalTickets,
      availableTickets: totalTickets,
    });

    await event.save();
    res.status(201).json({ message: "Event initialized successfully", event });
  } catch (error) {
    res.status(500).json({ error: "Server error during event initialization" });
  }
};

// Book a ticket
const bookTicket = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user, eventId } = req.body;

    // Fetch the event with an atomic operation
    const event = await Event.findById(eventId).session(session);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if tickets are available
    if (event.availableTickets > 0) {
      // Decrement available tickets and confirm booking
      event.availableTickets -= 1;
      const booking = new Booking({
        user,
        event: eventId,
        status: "confirmed",
      });

      await event.save({ session });
      await booking.save({ session });

      await session.commitTransaction();
      res.status(201).json({ message: "Ticket booked successfully", booking });
    } else {
      // Add user to the waiting list
      const waitingList = new WaitingList({ user, event: eventId });
      await waitingList.save({ session });

      await session.commitTransaction();
      res
        .status(200)
        .json({
          message: "Event sold out, added to waiting list",
          waitingList,
        });
    }
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: "Server error during ticket booking" });
  } finally {
    session.endSession();
  }
};

const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user, eventId } = req.body;

    // Find the booking to cancel
    const booking = await Booking.findOneAndDelete({
      user,
      event: eventId,
    }).session(session);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update event to increase available tickets
    const event = await Event.findById(eventId).session(session);
    event.availableTickets += 1;
    await event.save({ session });

    // Check the waiting list for users
    const nextInLine = await WaitingList.findOneAndDelete({
      event: eventId,
    }).session(session);
    if (nextInLine) {
      // Create a new booking for the next user in line
      const newBooking = new Booking({
        user: nextInLine.user,
        event: eventId,
        status: "confirmed",
      });
      await newBooking.save({ session });

      // Decrease available tickets since it's reassigned
      event.availableTickets -= 1;
      await event.save({ session });

      res.status(200).json({
        message: "Booking cancelled and reassigned to the waiting list",
        canceledBooking: booking,
        reassignedBooking: newBooking,
      });
    } else {
      res.status(200).json({
        message: "Booking cancelled, ticket made available",
        canceledBooking: booking,
      });
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: "Server error during cancellation" });
  } finally {
    session.endSession();
  }
};

const viewEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch event details
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Fetch waiting list count
    const waitingListCount = await WaitingList.countDocuments({
      event: eventId,
    });

    res.status(200).json({
      event: event.name,
      availableTickets: event.availableTickets,
      waitingListCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error fetching event status" });
  }
};

module.exports = {
  initializeEvent,
  bookTicket,
  cancelBooking,
  viewEventStatus
};
