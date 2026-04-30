import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { aj } from './lib/arcjet.js';

const app = express()

app.set("trust proxy", true);

app.use(express.json({
    limit: "100mb"
}));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CORS_ORIGIN, 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, server requests

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error('Not allowed by CORS'));
      }

      callback(null, true);
    },
    credentials: true,
  })
);
// used to parse cookies from incoming requests
app.use(cookieParser())
// used to set various HTTP headers for security purposes
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Welcome to the Product Store API');
})

// app.use(async (req, res, next) => {
//   try {
//     const decision = await aj.protect(req,
//       {
//         requested: 1 // specifies that each req consumes 1 token from the bucket
//       }
//     )
//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         res.status(420).json({
//           error: "Too many requests, please try again later."
//         })
//       }
//       else if (decision.reason.isBot()) {
//         res.status(403).json({
//           error: "Bot access is not allowed."
//         })
//       }
//       else {
//         res.status(403).json({
//           error: "Forbidden request."
//         })
//       }
//       return 

//     }
//     next()
//   } catch (error) {
//     console.log("Arcjet error: ", error)
//   }
// })


import productRouter from "./routes/product.route.js";
import userRouter from "./routes/user.route.js";
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";

app.use('/api/v1/productStore/products', productRouter)
app.use('/api/v1/productStore/users', userRouter)
app.use(('/api/v1/productStore/orders'), orderRouter)
app.use(('/api/v1/productStore/cart'), cartRouter)
export default app