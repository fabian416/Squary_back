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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTransactions = exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.getTransactionsByGroup = exports.createTransaction = exports.setIo = void 0;
const transaction_model_1 = require("../models/transaction.model");
const DebtService = __importStar(require("../services/debt.service"));
const group_model_1 = require("../models/group.model");
const user_model_1 = require("../models/user.model");
let io;
const setIo = (socketIo) => {
    io = socketIo;
};
exports.setIo = setIo;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, description, proposedBy, sharedWith, type, groupId } = req.body;
        // Validación de campos requeridos
        if (!amount || !description || !proposedBy || !sharedWith || !type || !groupId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }
        // Validación del grupo
        const numGroupId = Number(groupId);
        const group = yield group_model_1.Group.findOne({ where: { id: numGroupId } });
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        // Crear la transacción
        let newTransaction = new transaction_model_1.Transaction();
        newTransaction.amount = amount;
        newTransaction.description = description;
        newTransaction.proposedby = proposedBy;
        newTransaction.sharedWith = sharedWith;
        newTransaction.type = type;
        newTransaction.togroupid = groupId;
        console.log("Group ID:", groupId);
        console.log("Transaction before saving:", newTransaction);
        newTransaction = yield newTransaction.save();
        // Lógica para crear deudas (si es necesario)
        if (type === 'EXPENSE') {
            yield DebtService.createDebtsFromTransaction(newTransaction, sharedWith, proposedBy);
        }
        return res.status(201).json(newTransaction);
    }
    catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.createTransaction = createTransaction;
const getTransactionsByGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    if (!groupId) {
        return res.status(400).json({ message: 'Group ID is required.' });
    }
    try {
        const transactions = yield transaction_model_1.Transaction.find({ where: { togroupid: Number(groupId) } });
        // Obtener todas las direcciones únicas de las transacciones
        const uniqueAddresses = [...new Set(transactions.flatMap(t => t.sharedWith))];
        // Obtener los alias para esas direcciones
        const users = yield user_model_1.User.findByIds(uniqueAddresses);
        const addressToAliasMap = {};
        users.forEach(user => {
            addressToAliasMap[user.walletAddress] = user.alias;
        });
        // Reemplazar direcciones con alias en las transacciones
        const transformedTransactions = transactions.map(transaction => (Object.assign(Object.assign({}, transaction), { sharedWith: transaction.sharedWith.map(address => addressToAliasMap[address] || address) })));
        return res.status(200).json(transformedTransactions);
    }
    catch (error) {
        console.error('Error fetching transactions for group:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getTransactionsByGroup = getTransactionsByGroup;
const getTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Transaction ID is required.' });
    }
    try {
        const transaction = yield transaction_model_1.Transaction.findOne({ where: { id: Number(id) } });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        return res.status(200).json(transaction);
    }
    catch (error) {
        console.error('Error fetching transaction:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getTransactionById = getTransactionById;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id; // Asumiendo que recibes el id como parámetro de ruta
    const transactionId = Number(id); // Convertir la cadena a número
    try {
        const transaction = yield transaction_model_1.Transaction.findOne({ where: { id: transactionId } });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        // Aquí, puedes proceder a actualizar los campos de la transacción como lo necesites.
        // Por ejemplo:
        // transaction.amount = req.body.amount;
        // await transaction.save();
        return res.status(200).json(transaction);
    }
    catch (error) {
        console.error('Error updating transaction:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Transaction ID is required.' });
    }
    try {
        const transactionId = Number(id);
        const transaction = yield transaction_model_1.Transaction.findOne({ where: { id: transactionId } });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        yield transaction_model_1.Transaction.remove(transaction);
        return res.status(200).json({ message: 'Transaction deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting transaction:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.deleteTransaction = deleteTransaction;
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transaction_model_1.Transaction.find();
        return res.status(200).json(transactions);
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getAllTransactions = getAllTransactions;
