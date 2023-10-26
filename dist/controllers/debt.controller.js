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
exports.getDebtById = exports.getDebtsByGroup = exports.createDebt = void 0;
const DebtService = __importStar(require("../services/debt.service"));
const createDebt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const debtInfo = req.body;
        const newDebt = yield DebtService.createDebt(debtInfo);
        return res.json(newDebt);
    }
    catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: "Error al crear la deuda", error: errorMessage });
    }
});
exports.createDebt = createDebt;
const getDebtsByGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        const debts = yield DebtService.getDebtsByGroup(groupId);
        return res.json(debts);
    }
    catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: "Error al obtener las deudas del grupo", error: errorMessage });
    }
});
exports.getDebtsByGroup = getDebtsByGroup;
const getDebtById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const debtId = parseInt(req.params.debtId, 10);
        const debt = yield DebtService.getDebtById(debtId);
        if (debt) {
            return res.json(debt);
        }
        else {
            return res.status(404).json({ message: "Deuda no encontrada" });
        }
    }
    catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: "Error al obtener la deuda", error: errorMessage });
    }
});
exports.getDebtById = getDebtById;
