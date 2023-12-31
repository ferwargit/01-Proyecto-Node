import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
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
export default model('Customer', customerSchema);
// 2da opción
// const Customer = model('Customer', customerSchema);
// export default Customer;
