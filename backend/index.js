require('dotenv').config();
const Person = require('./model/personDB');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

morgan.token('person', (req) => {
  if (req.method == 'GET') return '';
  return JSON.stringify(req.body);
});
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
app.use(cors());

app.listen(PORT, () => console.log('listening on port ', PORT));

app.get('/', (req, res) => res.send('hello'));

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => res.json({ error: err.message }));
});

app.get('/api/persons/info', (req, res) => {
  const date = new Date();
  Person.countDocuments({})
    .then((count) => {
      res.send(`<p>Phonebook has info ${count} on people <br/> ${date.toString()}</p>`);
    })
    .catch((err) => res.json({ error: err.message }));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (!person) return res.status(404).end('person not found');
      res.status(200).json(person);
    })
    .catch((err) => {
      next(err);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((person) => {
      if (!person) return res.status(404).end('person not found or already deleted');

      res.status(200).send(`${person.name} id: ${person.id} was deleted`);
    })
    .catch((err) => {
      next(err);
    });
});

app.post('/api/persons', (req, res, next) => {
  const person = req.body;
  Person.find({})
    .then((peopleJSON) => {
      const existingNames = peopleJSON.map((person) => person.name);
      console.log('EXISTING NAMES', existingNames);

      // if (!person) return res.status(400).end('invalid person cant add');

      // if (!person.name)
      //   return res.status(400).json({
      //     error: 'must provide name',
      //   });

      // if (!person.number)
      //   return res.status(400).json({
      //     error: 'must provide number',
      //   });
      if (existingNames.find((p) => p == person.name))
        return res.status(400).json({
          error: 'must provide unique name',
        });

      const personToAdd = new Person({
        ...person,
      });
      personToAdd
        .save()
        .then(() => {
          console.log('added person succesfully ');
          res.status(201).json(personToAdd);
        })
        .catch((err) => {
          // res.status(404).json({ error: err.message });
          next(err);
        });
    })
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  const updatedPerson = {
    name: body.name,
    number: body.number,
  };

  const options = {
    new: true,
    runValidators: true,
    context: 'query',
  };
  Person.findByIdAndUpdate(req.params.id, updatedPerson, options)
    .then((result) => {
      if (!result) return res.status(404).json({ error: 'person dne or already deleted' });
      res.status(200).json(body);
    })
    .catch((err) => next(err));
});
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown Endpoint' });
};
app.use(unknownEndpoint);

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
app.use(errorHandler);
