import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users.router.js';
import restaurantsRouter from './routes/restaurants.router.js';

const app = express();

//activating cors and express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//using express middleware for the main router urls
//the requests are declared within the respective routers
app.use('/api/users', usersRouter); 
app.use('/api/restaurants', restaurantsRouter);
export default app;