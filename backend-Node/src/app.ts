// 1. Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
import { Customer } from './models/customer';

// 2. Configurations
mongoose.set('strictQuery', false);
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// 3. Constants
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

// 4. Initialize app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Routes
app.get('/', (req, res) => {
  res.send('Welcome!!');
});

// 6. API endpoints
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
    const customer = await Customer.findOneAndReplace(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(customer);
    res.json({ customer });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(customer);
    res.json({ customer });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  console.log(req.params);
  const orderId = req.params.id;
  req.body._id = orderId;
  try {
    const result = await Customer.findOneAndUpdate(
      { 'orders._id': orderId },
      { $set: { 'orders.$': req.body } },
      { new: true }
    );
    console.log(result);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const result = await Customer.findOne({ 'orders._id': req.params.id });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.log(error.message);
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
