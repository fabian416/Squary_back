import express from 'express';
import * as transactionController from '../controllers/transaction.controller';

const router = express.Router();

// Endpoint to create a transaction
router.post('/create', transactionController.createTransaction);

// Endpoint to get a transaction by Group id
router.get('/:groupId/expenses', transactionController.getTransactionsByGroup);

// Endpoint to get a transaction by his ID
router.get('/:id', transactionController.getTransactionById);

// Endpoint to update a transaction
router.put('/:id', transactionController.updateTransaction);

// Endpoint to delete a transaction
router.delete('/:id', transactionController.deleteTransaction);

// Endpoint to get all the trasnactions
router.get('/', transactionController.getAllTransactions);

// Endpoint para liquidar deudas
router.post('/settle', transactionController.settleDebts);

export default router;
