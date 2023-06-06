const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const database = process.env.DATABASE_LINK.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connect_database = () => {
  mongoose
    .connect(database)
    .then(() => console.log('Connected to database successfully'))
    .catch((err) => {
      console.log("Couldn't connect to database...");
      console.log(err.message);
    });
};

module.exports = connect_database;
