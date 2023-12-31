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
exports.default = (0, mongoose_1.model)('Customer', customerSchema);
// 2da opción
// const Customer = model('Customer', customerSchema);
// export default Customer;
