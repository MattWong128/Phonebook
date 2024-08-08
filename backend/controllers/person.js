const personRouter = require('express').Router();
const Person = require('../model/person');

personRouter.get('', (req, res) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => res.json({ error: err.message }));
});

personRouter.get('/info', (req, res) => {
  const date = new Date();
  Person.countDocuments({})
    .then((count) => {
      res.send(`<p>Phonebook has info ${count} on people <br/> ${date.toString()}</p>`);
    })
    .catch((err) => res.json({ error: err.message }));
});

personRouter.get('/:id', (req, res, next) => {
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

personRouter.delete('/:id', (req, res, next) => {
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

personRouter.post('/', (req, res, next) => {
  const person = req.body;
  Person.find({})
    .then((peopleJSON) => {
      const existingNames = peopleJSON.map((person) => person.name);
      console.log('EXISTING NAMES', existingNames);

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
          next(err);
        });
    })
    .catch((err) => next(err));
});

personRouter.put('/:id', (req, res, next) => {
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

module.exports = personRouter;
