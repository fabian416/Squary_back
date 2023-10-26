import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { Debt } from '../models/debt.model';
import { Group } from '../models/group.model'; 
import { User } from '../models/user.model';

let io: any;

export const setIo = (socketIo: any) => {
    io = socketIo;
};
export const createTransaction = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { amount, description, proposedBy, sharedWith, type, groupId } = req.body;

        // Validación de campos requeridos
        if (!amount || !description || !proposedBy || !sharedWith || !type || !groupId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Validación del grupo
        const numGroupId = Number(groupId);
        const group = await Group.findOne({ where: { id: numGroupId } });

        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        // Crear la transacción
        let newTransaction = new Transaction();
        newTransaction.amount = amount;
        newTransaction.description = description;
        newTransaction.proposedby = proposedBy;
        newTransaction.sharedWith = sharedWith;
        newTransaction.type = type;
        newTransaction.togroupid = groupId; // Asociando la transacción con el grupo

        newTransaction = await newTransaction.save();

        // Lógica para crear deudas (si es necesario)
        if (type === 'EXPENSE') {
            const debtAmount = amount / sharedWith.length;
            for (const member of sharedWith) {
                if (member !== proposedBy) {
                    let debt = new Debt();
                    debt.debtor = member;
                    debt.creditor = proposedBy;
                    debt.amount = debtAmount;
                    debt.transaction = newTransaction;
                    await debt.save();
                }
            }
        }

        return res.status(201).json(newTransaction);

    } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

export const getTransactionsByGroup = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    if (!groupId) {
        return res.status(400).json({ message: 'Group ID is required.' });
    }

    try {
        const transactions = await Transaction.find({ where: { togroupid: Number(groupId) } });

        // Obtener todas las direcciones únicas de las transacciones
        const uniqueAddresses = [...new Set(transactions.flatMap(t => t.sharedWith))];

        // Obtener los alias para esas direcciones
        const users = await User.findByIds(uniqueAddresses);
        const addressToAliasMap: { [address: string]: string } = {};
        users.forEach(user => {
            addressToAliasMap[user.walletAddress] = user.alias;
        });

        // Reemplazar direcciones con alias en las transacciones
        const transformedTransactions = transactions.map(transaction => ({
            ...transaction,
            sharedWith: transaction.sharedWith.map(address => addressToAliasMap[address] || address)
        }));

        return res.status(200).json(transformedTransactions);
    } catch (error) {
        console.error('Error fetching transactions for group:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};



    export const getTransactionById = async (req: Request, res: Response) => {
        const { id } = req.params;
    
        if (!id) {
            return res.status(400).json({ message: 'Transaction ID is required.' });
        }
    
        try {
            const transaction = await Transaction.findOne({ where: { id: Number(id) } });

    
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found.' });
            }
    
            return res.status(200).json(transaction);
    
        } catch (error) {
            console.error('Error fetching transaction:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
    
    export const updateTransaction = async (req: Request, res: Response) => {
        const id = req.params.id; // Asumiendo que recibes el id como parámetro de ruta
        const transactionId = Number(id); // Convertir la cadena a número
    
        try {
            const transaction = await Transaction.findOne({ where: { id: transactionId } });
    
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found.' });
            }
    
            // Aquí, puedes proceder a actualizar los campos de la transacción como lo necesites.
            // Por ejemplo:
            // transaction.amount = req.body.amount;
            // await transaction.save();
    
            return res.status(200).json(transaction);
        } catch (error) {
            console.error('Error updating transaction:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
    
    export const deleteTransaction = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
    
        if (!id) {
            return res.status(400).json({ message: 'Transaction ID is required.' });
        }
    
        try {

            const transactionId = Number(id);
            const transaction = await Transaction.findOne({ where: { id: transactionId } });


            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found.' });
            }
    
            await Transaction.remove(transaction);
            return res.status(200).json({ message: 'Transaction deleted successfully.' });
        } catch (error) {
            console.error('Error deleting transaction:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
    
    export const getAllTransactions = async (req: Request, res: Response) => {
        try {
            const transactions = await Transaction.find();
    
            return res.status(200).json(transactions);
    
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
    

    export async function settleDebts(req: Request, res: Response): Promise<Response> {
        try {
            const { groupId } = req.body; // suponiendo que necesitas el ID del grupo para obtener todas las deudas de ese grupo
    
            if (!groupId) {
                return res.status(400).json({ message: 'Group ID is required.' });
            }
    
            // Obtener todas las deudas para este grupo que aún no se han liquidado
            const group = await Group.findOne(groupId);  // suponiendo que Group es tu modelo para grupos
            const pendingDebts = await Debt.find({ where: { group: groupId } });

            // Procesa las deudas y crea transacciones propuestas
            // (Esta es la parte compleja y puede requerir ajustes según la lógica que desees implementar)
            // ... 
    
            return res.status(200).json({ message: 'Settlement transactions proposed.' });
        } catch (error) {
            console.error('Error settling debts:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
    