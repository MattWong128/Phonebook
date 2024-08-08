const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const personRouter = require('./controllers/person');
const middlware = require('./utils/middleware');

mongoose.set('strictQuery', false);

mongoose
  .connect(config.URL)

  .then(() => {
    logger.info('DATABASE SUCCESSFULLY CONNECTED');
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message);
  });

app.use(express.static('dist'));
app.use(express.json());
app.use(middlware.requestLogger);
app.use(cors());

app.use('/api/persons', personRouter);

app.use(middlware.unknownEndpoint);
app.use(middlware.errorHandler);

module.exports = app;
