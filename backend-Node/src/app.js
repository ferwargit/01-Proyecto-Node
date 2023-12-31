"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-nocheck
// 1. Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Customer = require('./models/customer');
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
app.get('/api/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield mongoose.connection.db.listCollections().toArray());
    try {
        const result = yield Customer.find();
        res.json({ customers: result });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
app.get('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({
        requestParams: req.params,
        requestQuery: req.query,
    });
    try {
        const { id: customerId } = req.params;
        console.log(customerId);
        const customer = yield Customer.findById(customerId);
        console.log(customer);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        else {
            res.json({ customer });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
app.put('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const customer = yield Customer.findOneAndReplace({ _id: customerId }, req.body, { new: true });
        console.log(customer);
        res.json({ customer });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}));
app.patch('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const customer = yield Customer.findOneAndUpdate({ _id: customerId }, req.body, { new: true });
        console.log(customer);
        res.json({ customer });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}));
app.patch('/api/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const orderId = req.params.id;
    req.body._id = orderId;
    try {
        const result = yield Customer.findOneAndUpdate({ 'orders._id': orderId }, { $set: { 'orders.$': req.body } }, { new: true });
        console.log(result);
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}));
app.get('/api/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Customer.findOne({ 'orders._id': req.params.id });
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}));
app.delete('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield Customer.deleteOne({ _id: customerId });
        res.json({ deletedCount: result.deletedCount });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
app.post('/api/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const customer = new Customer(req.body);
    try {
        yield customer.save();
        res.status(201).json({ customer });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
app.post('/', (req, res) => {
    res.send('This is a post request!');
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start();
