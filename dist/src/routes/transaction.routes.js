"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController = __importStar(require("../controllers/transaction.controller"));
const router = express_1.default.Router();
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
router.get('/:groupId/settleState', transactionController.getSettleStatus);
router.post('/:groupId/resetSettleState', transactionController.resetSettle);
router.post('/:groupid/settlementTransaction', transactionController.settleSpecialTransaction);
router.get('/:groupId/settlementTransactions', transactionController.getSettlementTransactionsByGroup);
exports.default = router;
