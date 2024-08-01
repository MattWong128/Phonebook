require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const url = process.env.URL;
mongoose.set('strictQuery', false);

async function connectToDatabase() {
  try {
    await mongoose.connect(url);
    console.log('DATABASE CONNECTION SUCCESSFULL');
  } catch (error) {
    console.log('DATABASE CONNECTION FAILED', err);
  }
}

async function initialze() {
  await connectToDatabase();
  const personSchema = new Schema({
    name: String,
    number: String,
  });
  // personSchema.set('toJSON', {
  //   transform: (document, returnedObject) => {

  //   },
  // });

  module.exports = mongoose.model('Person', personSchema);
}

initialze();
