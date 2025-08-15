const express = require('express');
const connection = require('./config/db');
const userRoutes = require('./routes/user.routes');


const app = express();
// Middleware
app.use(express.json());

// Connect to DB
connection();

// Routes
app.use('/api/users', userRoutes);

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});