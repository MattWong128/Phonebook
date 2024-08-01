require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const url = process.env.URL;
mongoose.set('strictQuery', false);

mongoose
  .connect(url)
  .then(console.log('database connected'))
  .catch(() => console.log('databased failed'));

const personSchema = new Schema({
  name: String,
  number: String,
});
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
