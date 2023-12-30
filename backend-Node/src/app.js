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

app.get('/api/customers/:id', async (req, res) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query,
  });
  try {
    const { id: customerId } = req.params;
    console.log(customerId);
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    } else {
      res.json({ customer });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.replaceOne({ _id: customerId }, req.body);
    console.log(result);
    res.json({ updatedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();
    res.status(201).json({ customer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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
