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
exports.settleDebtsController = exports.getDebtById = exports.getUnsettledDebtsByGroup = exports.getDebtsByGroup = exports.createDebt = void 0;
const debt_model_1 = require("../models/debt.model");
const DebtService = __importStar(require("../services/debt.service"));
const createDebt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const debtInfo = req.body;
        console.log('Request Data for Create Debt:', debtInfo); // Agregar registro de solicitud
        const newDebt = yield DebtService.createDebt(debtInfo);
        console.log('New Debt Created:', newDebt); // Agregar registro de la nueva deuda creada
        return res.json(newDebt);
    }
    catch (error) {
        const errorMessage = error.message;
        console.log('Error Creating Debt:', errorMessage); // Agregar registro de error
        return res.status(500).json({ message: "Error al crear la deuda", error: errorMessage });
    }
});
exports.createDebt = createDebt;
const getDebtsByGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        console.log('Group ID for Get Debts:', groupId); // Agregar registro del ID de grupo
        const debts = yield DebtService.getDebtsByGroup(groupId);
        console.log('Debts Retrieved:', debts); // Agregar registro de deudas recuperadas
        return res.json(debts);
    }
    catch (error) {
        const errorMessage = error.message;
        console.log('Error Getting Debts:', errorMessage); // Agregar registro de error
        return res.status(500).json({ message: "Error al obtener las deudas del grupo", error: errorMessage });
    }
});
exports.getDebtsByGroup = getDebtsByGroup;
const getUnsettledDebtsByGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID.' });
    }
    try {
        const debts = yield debt_model_1.Debt.find({
            where: {
                group: { id: groupId },
                transaction: { includedInSettlement: false }
            },
            relations: ["transaction"] // Asegúrate de incluir la relación aquí
        });
        const simplifiedDebts = yield DebtService.simplifyDebts(debts);
        res.json(simplifiedDebts);
    }
    catch (error) {
        console.error('Error fetching unsettled debts for group:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getUnsettledDebtsByGroup = getUnsettledDebtsByGroup;
const getDebtById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const debtId = parseInt(req.params.debtId, 10);
        console.log('Debt ID for Get Debt:', debtId); // Agregar registro del ID de deuda
        const debt = yield DebtService.getDebtById(debtId);
        if (debt) {
            console.log('Debt Retrieved:', debt); // Agregar registro de deuda recuperada
            return res.json(debt);
        }
        else {
            return res.status(404).json({ message: "Deuda no encontrada" });
        }
    }
    catch (error) {
        const errorMessage = error.message;
        console.log('Error Getting Debt:', errorMessage); // Agregar registro de error
        return res.status(500).json({ message: "Error al obtener la deuda", error: errorMessage });
    }
});
exports.getDebtById = getDebtById;
const settleDebtsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = parseInt(req.body.groupId, 10);
        console.log('Group ID for Settle Debts:', groupId); // Agregar registro del ID de grupo
        const result = yield DebtService.settleDebts(groupId);
        console.log('Settlement Result:', result); // Agregar registro del resultado del proceso de conciliación
        return res.status(200).json(result);
    }
    catch (error) {
        const errorMessage = error.message;
        console.log('Error Settling Debts:', errorMessage); // Agregar registro de error
        return res.status(500).json({ message: errorMessage });
    }
});
exports.settleDebtsController = settleDebtsController;
