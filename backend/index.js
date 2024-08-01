require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT;
const Person = require('./model/personDB');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
morgan.token('person', (req, res) => {
  if (req.method == 'GET') return '';
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));

app.listen(PORT, () => console.log('listening on port ', PORT));

app.get('/', (req, res) => res.send('hello'));

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => console.log('error'));
});

app.get('/api/persons/info', (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info ${persons.length} on people <br/> ${date.toString()}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id == id);

  if (!person) return res.status(404).end('person not found');
  res.status(200).json(person);
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
  const existingNames = persons.map((p) => p.name);

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

  const personToAdd = {
    ...person,
    id: String(Math.floor(Math.random() * 1000)),
  };

  persons = persons.concat(personToAdd);
  res.status(201).json(personToAdd);
});
