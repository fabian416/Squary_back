"use strict";
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
exports.getAllTransactionsForGroup = exports.createTransaction = exports.setIo = void 0;
const transaction_model_1 = require("../models/transaction.model");
const database_1 = require("../database");
let io;
const setIo = (socketIo) => {
    io = socketIo;
};
exports.setIo = setIo;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = new transaction_model_1.Transaction();
    transaction.amount = req.body.amount;
    transaction.description = req.body.description;
    try {
        const savedTransaction = yield database_1.AppDataSource.manager.save(transaction_model_1.Transaction, transaction);
        //  Emit an event when a new transaction is created
        io.emit('transactionCreated', savedTransaction);
        res.status(200).send(savedTransaction);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.createTransaction = createTransaction;
const getAllTransactionsForGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    if (!groupId) {
        return res.status(400).send({ message: 'No se proporcionó un groupId válido.' });
    }
    try {
        const groupIdNumber = parseInt(groupId, 10);
        const transactions = yield database_1.AppDataSource.manager.find(transaction_model_1.Transaction, { where: { toGroup: { id: groupIdNumber } } });
        if (!transactions.length) {
            return res.status(404).send({ message: 'No se encontraron transacciones para el groupId proporcionado.' });
        }
        return res.status(200).send(transactions);
    }
    catch (err) {
        console.error('Error al obtener las transacciones:', err);
        return res.status(500).send({ message: 'Hubo un error al obtener las transacciones.' });
    }
});
exports.getAllTransactionsForGroup = getAllTransactionsForGroup;
