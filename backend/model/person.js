const mongoose = require('mongoose');
const { Schema } = mongoose;

const personSchema = new Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: [true, 'User phone number required'],
    minLength: 8,
    validate: {
      validator: (number) => {
        return /^\d{2,3}-\d+$/.test(number);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
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

module.exports = Person;
