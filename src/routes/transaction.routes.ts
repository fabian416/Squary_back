import express from 'express';
import * as transactionController from '../controllers/transaction.controller';

const router = express.Router();

router.post('/create', transactionController.createTransaction);
router.get('/:groupId', transactionController.getAllTransactionsForGroup);


export default router;
