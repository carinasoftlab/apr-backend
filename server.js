const mongoose = require('mongoose');
const dotenv = require('dotenv');


process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err);
  process.exit(1);
});

dotenv.config({ path: './.env' });
const app = require('./app');

const socket = require("./socket");


const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    socketTimeoutMS: 30000
  })
  .then(() => {
    console.log('DB connection successful!');

});


const port = process.env.PORT || 8087;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const io = socket.init(server);


process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
