"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    industry: String,
    orders: [
        {
            description: String,
            amountInCents: Number,
        },
    ],
});
// 1.-Con { Customer } en app.ts
// module.exports = mongoose.model('Customer', customerSchema);
// 2.-Con Customer en app.ts
// 1ra opción
// export default model('Customer', customerSchema);
// 2da opción
const Customer = (0, mongoose_1.model)('Customer', customerSchema);
const c = new Customer({
    name: 'test',
    industry: 'test',
});
console.log(c.name);
exports.default = Customer;
