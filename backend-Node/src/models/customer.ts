import { HydratedDocument, Schema, model } from 'mongoose';

interface IOrder {
  description: string;
  amountInCents?: number;
}

interface ICustomer {
  name: string;
  industry?: string;
  orders?: IOrder[];
}

const customerSchema = new Schema<ICustomer>({
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
const Customer = model('Customer', customerSchema);

const c: HydratedDocument<ICustomer> = new Customer({
  name: 'test',
  industry: 'test',
});

console.log(c.name);

export default Customer;
