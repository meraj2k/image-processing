const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');
const statusRoutes = require('./routes/statusRoutes');

const app = express();

app.use(express.json());
app.use('/api/v1', uploadRoutes);
app.use('/api/v1', statusRoutes);

module.exports = app;
