import express, { Express, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { AppDataSource } from "./database";
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import 'reflect-metadata';
import  morgan  from 'morgan';

import userRoutes from './routes/user.routes';
import groupRoutes from './routes/group.routes';
import transactionRoutes from './routes/transaction.routes';

import * as userController from './controllers/user.controller';
import * as groupController from './controllers/group.controller'; 
import * as transactionController from './controllers/transaction.controller';

import dotenv from 'dotenv';
dotenv.config();


const app: Express = express();
const server = http.createServer(app);


//Configuration of CORS for Express
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//Configuring CORS for Socket.io
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true
    }
});

userController.setIo(io);
groupController.setIo(io);
transactionController.setIo(io);

// Middleware to process JSON
app.use(express.json());

app.use(morgan('dev'));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Body:', req.body);
    next();
});


// Routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/transactions', transactionRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("¡Algo salió mal!");
});


const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

});
