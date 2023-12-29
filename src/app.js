const express = require('express');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const Customer = require('./models/customer');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

const customers = [
  {
    name: 'Caleb',
    industry: 'music',
  },
  {
    name: 'John',
    industry: 'networking',
  },
  {
    name: 'Sal',
    industry: 'sports medicine',
  },
];

const customer = new Customer({
  name: 'Jhon',
  industry: 'marketing',
});

app.get('/', (req, res) => {
  res.send('Welcome!');
});

app.get('/api/customers', async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray());
  try {
    const result = await Customer.find();
    res.json({ customers: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/customers', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.post('/', (req, res) => {
  res.send('This is a post request!');
});

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
