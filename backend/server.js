const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const projectsRouter = require('./routes/projects');
const aiRouter = require('./routes/ai');

app.use('/api/projects', projectsRouter);
app.use('/api/ai', aiRouter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/siteguide')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
