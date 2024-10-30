# Event Ticket Booking System
## Description
This is a Node.js application for an event ticket booking system. It provides a RESTful API for handling the core functionalities of the system, including:

Initializing an event with a set number of available tickets.
Allowing users to book tickets concurrently.
Implementing a waiting list for when tickets are sold out.
Providing endpoints to view available tickets and the waiting list.
Handling ticket cancellations and automatic assignment to waiting list users.
Saving the order details to a MongoDB database.

## Skills Assessed

Node.js and Express.js proficiency
Asynchronous programming
Concurrency and race condition handling
RESTful API design
Error handling and edge case management
In-memory data structure design and management
Test-Driven Development (TDD)
Code organization and modularity

## Requirements

Node.js
Express.js
MongoDB

## Installation

Clone the repository:

git clone https://github.com/Code-Gale/event-ticket-booking-system.git

Install the dependencies:

cd event-ticket-booking-system
```
npm install
```

Set up the environment variables:

cp .env

Update the .env file with your MongoDB connection details and JWT secret

API Endpoints

POST /initialize: Initialize a new event with a given number of tickets.
POST /book: Book a ticket for a user. If sold out, add the user to the waiting list.
POST /cancel: Cancel a booking for a user. If there's a waiting list, automatically assign the ticket to the next user in line.
GET /status/:eventId: Retrieve the current status of an event (available tickets, waiting list count).


## Concurrency Handling
The application ensures thread-safety for all operations and properly handles race conditions, especially for booking and cancellation operations.
## Error Handling
The application implements comprehensive error handling for all possible scenarios and provides meaningful error messages in the API responses.
## Test-Driven Development (TDD)
The application follows a TDD approach, with unit tests for all core functionalities and integration tests for the API endpoints. The test coverage is at least 80%.
## Code Quality
The application follows Node.js and JavaScript best practices, uses ES6+ features appropriately, and has a modular and maintainable code structure.

## Bonus Features
Implemented rate limiting for the API endpoints.
Added basic authentication for sensitive operations.


Possible Improvements

Implement a more robust and scalable data storage solution, such as a distributed cache or a dedicated ticket management database.
Add support for event scheduling and ticket pricing.
Implement a more comprehensive authentication and authorization system.
Enhance the API with additional features, such as bulk ticket booking, ticket transfers, and user management.