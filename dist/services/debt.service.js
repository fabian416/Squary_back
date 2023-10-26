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
exports.getDebtById = exports.getDebtsByGroup = exports.createDebt = void 0;
const debt_model_1 = require("../models/debt.model");
const database_1 = require("../database");
const createDebt = (debtInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const debt = new debt_model_1.Debt();
    // asigna los valores de debtInfo al objeto debt
    debt.debtor = debtInfo.debtor;
    debt.creditor = debtInfo.creditor;
    debt.groupId = debtInfo.groupid;
    debt.transaction = debtInfo.transactionid;
    debt.amount = debtInfo.amount;
    const debtRepository = database_1.AppDataSource.getRepository(debt_model_1.Debt);
    return yield debtRepository.save(debt);
});
exports.createDebt = createDebt;
const getDebtsByGroup = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const debtRepository = database_1.AppDataSource.getRepository(debt_model_1.Debt);
    const debts = yield debtRepository
        .createQueryBuilder('debt')
        .innerJoin('debt.group', 'group')
        .where('group.id = :groupId', { groupId })
        .getMany();
    return debts;
});
exports.getDebtsByGroup = getDebtsByGroup;
const getDebtById = (debtId) => __awaiter(void 0, void 0, void 0, function* () {
    const debtRepository = database_1.AppDataSource.getRepository(debt_model_1.Debt);
    return yield debtRepository.findOne({ where: { id: debtId } });
});
exports.getDebtById = getDebtById;
