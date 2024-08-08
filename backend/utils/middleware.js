const morgan = require('morgan');

morgan.token('person', (req) => {
  if (req.method == 'GET') return '';
  return JSON.stringify(req.body);
});
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :person');

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown Endpoint' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger,
};
