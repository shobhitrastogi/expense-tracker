const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const usersRouter = require('./routes/users');
const expensesRouter = require('./routes/expenses');
dotenv.config();
const cors = require('cors');
const app = express();
app.use(express.json());

connectDB();
app.use(cors());
app.use('/api/users', usersRouter);
app.use('/api/expenses', expensesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
