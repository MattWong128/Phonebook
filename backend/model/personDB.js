require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const url = process.env.URL;
mongoose.set('strictQuery', false);

mongoose
  .connect(url)

  .then((result) => {
    console.log('DATABASE SUCCESSFULLY CONNECTED');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  test: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Person = mongoose.model('Person', personSchema);
// const person = new Person({
//   name: 'MARCUS',
//   number: 123,
// });
// person.save();

// Person.find({})
//   .then((persons) => console.log(persons))
//   .catch((err) => console.log('eror', err));

module.exports = Person;
