import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { AppDataSource } from "../database"; 

let io: any;

export const setIo = (socketIo: any) => {
    io = socketIo;
};

export const createTransaction = async (req: Request, res: Response) => {
    const transaction = new Transaction();
    transaction.amount = req.body.amount;
    transaction.description = req.body.description;

    try {
        const savedTransaction = await AppDataSource.manager.save(Transaction, transaction);
        
        //  Emit an event when a new transaction is created
        io.emit('transactionCreated', savedTransaction);
        res.status(200).send(savedTransaction);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const getAllTransactionsForGroup = async (req: Request, res: Response) => {
    const groupId = req.params.groupId;

    if (!groupId) {
        return res.status(400).send({ message: 'No se proporcionó un groupId válido.' });
    }

    try {
        const groupIdNumber = parseInt(groupId, 10);
        const transactions = await AppDataSource.manager.find(Transaction, { where: { toGroup: { id: groupIdNumber } } });

        if (!transactions.length) {
            return res.status(404).send({ message: 'No se encontraron transacciones para el groupId proporcionado.' });
        }

        return res.status(200).send(transactions);
    } catch (err) {
        console.error('Error al obtener las transacciones:', err);
        return res.status(500).send({ message: 'Hubo un error al obtener las transacciones.' });
    }
};

