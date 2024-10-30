const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const eventRoutes = require('./src/routes/eventRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(errorHandler)

// API routes
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
