import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import actorsRouter from './api/actors';
import './db';
import './seedData'
import usersRouter from './api/users';
import authenticate from './authenticate';
import cors from "cors";
import defaultErrHandler from "./errHandler";

dotenv.config();

const app = express();
const port = process.env.PORT;

// app.use(passport.initialize());
// app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use(cors());
app.use(express.json());
// app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/actors',  actorsRouter);
app.use('/api/movies',  moviesRouter);

app.use(defaultErrHandler);
let server = app.listen(port, () => {
    console.info(`Server running at ${port}`);
});
module.exports = server
