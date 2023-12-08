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


// routes to confirm the transactions
router.post('/:groupId/initiateConfirmation', transactionController.initiateSettlementConfirmation);

router.post('/:groupId/confirm', transactionController.confirmSettlement);

router.get('/:groupId/confirmations', transactionController.getSettlementConfirmations);

router.get('/:groupId/settleState', transactionController.getSettleStatus)

router.post('/:groupId/resetSettleState', transactionController.resetSettle);

router.post('/:groupid/settlementTransaction', transactionController.settleSpecialTransaction);


router.get('/:groupId/settlementTransactions', transactionController.getSettlementTransactionsByGroup);


export default router;
