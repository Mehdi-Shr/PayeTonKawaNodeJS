const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const customerRoutes = require('./routes/customerRoutes');
const connectRabbitMQ = require('./config/rabbitmq');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error(err);
});

connectRabbitMQ().then(channel => {
  console.log('Connected to RabbitMQ');
}).catch(err => {
  console.error('Failed to connect to RabbitMQ:', err);
});

app.get('/',(req, res) => {
  res.send("Bienvenue sur le micro-service Customers")
})

app.use('/customers', customerRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
