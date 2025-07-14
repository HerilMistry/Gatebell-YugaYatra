require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite
const dbPath = path.join(__dirname, '../gatebell.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite:', err);
  } else {
    console.log('Connected to SQLite database!');
  }
});

// Create users table if it doesn't exist
const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);`;
db.run(createUsersTable, (err) => {
  if (err) {
    console.error('Failed to create users table:', err);
  } else {
    console.log('Users table ready.');
  }
});

// Routes
app.use('/api/auth', require('./routes/auth')(db));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 