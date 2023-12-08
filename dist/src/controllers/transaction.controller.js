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
exports.resetSettle = exports.getSettleStatus = exports.getSettlementConfirmations = exports.confirmSettlement = exports.initiateSettlementConfirmation = exports.getAllTransactions = exports.deleteTransaction = exports.updateTransaction = exports.getSettlementTransactionsByGroup = exports.getSettlementTransactions = exports.settleSpecialTransaction = exports.getTransactionById = exports.getTransactionsByGroup = exports.createTransaction = exports.setIo = void 0;
const transaction_model_1 = require("../models/transaction.model");
const DebtService = __importStar(require("../services/debt.service"));
const group_model_1 = require("../models/group.model");
const transactionsConfirmations_1 = require("../models/transactionsConfirmations");
const typeorm_1 = require("typeorm");
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
        const numGroupId = parseInt(groupId, 10);
        if (isNaN(numGroupId)) {
            return res.status(400).json({ message: 'Invalid group ID.' });
        }
        // Excluir las transacciones de asentamiento
        const transactions = yield transaction_model_1.Transaction.find({
            where: {
                togroupid: numGroupId,
                type: (0, typeorm_1.Not)('SETTLEMENT')
            }
        });
        return res.status(200).json(transactions);
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
const settleSpecialTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupId, amount, description } = req.body;
        // Validación básica de los campos
        if (!groupId || !amount || !description) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }
        // Encuentra el grupo asociado
        const group = yield group_model_1.Group.findOne({ where: { id: groupId } });
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        const existingSettlement = yield transaction_model_1.Transaction.findOne({
            where: {
                togroupid: groupId,
                type: 'SETTLEMENT'
            }
        });
        if (existingSettlement) {
            return res.status(400).json({ message: 'A settlement transaction already exists for this group.' });
        }
        // Crear la transacción de asentamiento
        let settlementTransaction = new transaction_model_1.Transaction();
        settlementTransaction.amount = amount;
        settlementTransaction.description = `Settlement executed at ${new Date().toISOString()}`;
        settlementTransaction.togroupid = groupId;
        settlementTransaction.type = 'SETTLEMENT';
        // Guardar la transacción de asentamiento
        settlementTransaction = yield settlementTransaction.save();
        const relatedTransactions = yield transaction_model_1.Transaction.find({
            where: { togroupid: groupId, includedInSettlement: false }
        });
        relatedTransactions.forEach((tx) => __awaiter(void 0, void 0, void 0, function* () {
            tx.includedInSettlement = true;
            yield tx.save();
        }));
        // Actualizar el estado de asentamiento del grupo
        group.settleCompleted = true;
        yield group.save();
        return res.status(201).json(settlementTransaction);
    }
    catch (error) {
        console.error('Error creating settlement transaction:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.settleSpecialTransaction = settleSpecialTransaction;
const getSettlementTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID.' });
    }
    const transactions = yield transaction_model_1.Transaction.find({
        where: {
            togroupid: groupId,
            type: 'SETTLEMENT'
        }
    });
    return res.status(200).json(transactions);
});
exports.getSettlementTransactions = getSettlementTransactions;
const getSettlementTransactionsByGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID.' });
    }
    try {
        // Buscar transacciones de asentamiento para el grupo especificado
        const settlements = yield transaction_model_1.Transaction.find({
            where: { togroupid: groupId, type: 'SETTLEMENT' }
        });
        res.status(200).json(settlements);
    }
    catch (error) {
        console.error('Error fetching settlement transactions for group:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getSettlementTransactionsByGroup = getSettlementTransactionsByGroup;
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
// Iniciar una confirmación de asentamiento
// Iniciar una confirmación de asentamiento
const initiateSettlementConfirmation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID.' });
    }
    try {
        const group = yield group_model_1.Group.findOne({ where: { id: groupId } });
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        const existingConfirmations = yield transactionsConfirmations_1.TransactionConfirmation.find({
            where: { group: { id: groupId } }
        });
        // Verifica si el asentamiento anterior ha sido completado
        if (existingConfirmations.length > 0 && !group.settleCompleted) {
            return res.status(400).json({ message: 'Settlement process is already in progress.' });
        }
        // Resetear o eliminar las confirmaciones existentes
        yield transactionsConfirmations_1.TransactionConfirmation.delete({ group: { id: groupId } });
        // Establecer settleCompleted en false para indicar que el proceso de asentamiento ha comenzado
        group.settleCompleted = false;
        yield group.save();
        // Crear una confirmación para cada miembro del grupo
        group.selectedSigners.forEach((memberAddress) => __awaiter(void 0, void 0, void 0, function* () {
            const newConfirmation = new transactionsConfirmations_1.TransactionConfirmation();
            newConfirmation.group = group;
            newConfirmation.userWalletAddress = memberAddress;
            yield newConfirmation.save();
        }));
        res.status(200).json({ message: 'Settlement confirmation initiated successfully.' });
    }
    catch (error) {
        console.error('Error initiating settlement confirmation:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.initiateSettlementConfirmation = initiateSettlementConfirmation;
// Confirmar asentamiento
const confirmSettlement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId, 10);
    const userWalletAddress = req.body.userWalletAddress;
    if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID.' });
    }
    try {
        const confirmation = yield transactionsConfirmations_1.TransactionConfirmation.findOne({
            where: {
                group: { id: groupId },
                userWalletAddress: userWalletAddress
            }
        });
        if (confirmation) {
            confirmation.confirmed = true;
            yield confirmation.save();
            return res.status(200).json({ message: 'Settlement confirmed successfully.' });
        }
        return res.status(404).json({ message: 'Confirmation not found.' });
    }
    catch (error) {
        console.error('Error confirming settlement:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.confirmSettlement = confirmSettlement;
// Obtener confirmaciones de asentamiento
const getSettlementConfirmations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID.' });
    }
    try {
        const confirmations = yield transactionsConfirmations_1.TransactionConfirmation.find({
            where: { group: { id: groupId } },
            relations: ["group", "user"]
        });
        return res.status(200).json(confirmations);
    }
    catch (error) {
        console.error('Error getting settlement confirmations:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getSettlementConfirmations = getSettlementConfirmations;
const getSettleStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID.' });
    }
    try {
        const group = yield group_model_1.Group.findOne({ where: { id: groupId } });
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        const confirmations = yield transactionsConfirmations_1.TransactionConfirmation.find({
            where: { group: { id: groupId }, confirmed: true }
        });
        const isInitiated = confirmations.length > 0;
        const isConfirmed = confirmations.length >= group.signatureThreshold;
        res.json({ initiated: isInitiated, confirmed: isConfirmed });
    }
    catch (error) {
        console.error('Error getting settle status:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getSettleStatus = getSettleStatus;
const resetSettle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID.' });
    }
    try {
        // Verificar si el grupo existe
        const group = yield group_model_1.Group.findOne({ where: { id: groupId } });
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        // Resetear el estado de las confirmaciones a 'false'
        yield transactionsConfirmations_1.TransactionConfirmation.update({ group: { id: groupId } }, { confirmed: false });
        res.status(200).json({ message: 'Settlement state reset successfully.' });
    }
    catch (error) {
        console.error('Error resetting settlement state:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.resetSettle = resetSettle;
