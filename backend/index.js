require('dotenv').config();
const Person = require('./model/personDB');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT;

const app = express();
let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];
morgan.token('person', (req, res) => {
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
  res.send(`<p>Phonebook has info ${persons.length} on people <br/> ${date.toString()}</p>`);
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (!person) return res.status(404).end('person not found');
      res.status(200).json(person);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json({ error: `${id} is an invalid id` });
      // next(err);
    });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id == id);

  if (!person) return res.status(404).end('person not found or already deleted');

  persons = persons.filter((p) => p.id != id);

  res.status(200).send(`${person.name} id: ${person.id} was deleted`);
});

app.post('/api/persons', (req, res) => {
  const person = req.body;
  Person.find({})
    .then((peopleJSON) => {
      const existingNames = peopleJSON.map((person) => person.name);
      console.log('EXISTING NAMES', existingNames);

      if (!person) return res.status(400).end('invalid person cant add');
      if (!person.name)
        return res.status(400).json({
          error: 'must provide name',
        });

      if (!person.number)
        return res.status(400).json({
          error: 'must provide number',
        });
      if (existingNames.find((p) => p == person.name))
        return res.status(400).json({
          error: 'must provide unique name',
        });

      const personToAdd = new Person({
        ...person,
      });
      persons = persons.concat(personToAdd);
      personToAdd.save().then(() => console.log('added person succesfully '));
      res.status(201).json(personToAdd);
    })
    .catch((err) => console.log(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown Endpoint' });
};
app.use(unknownEndpoint);
