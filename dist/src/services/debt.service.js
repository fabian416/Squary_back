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
exports.getDebtById = exports.settleDebts = exports.getDebtsByGroup = exports.createDebt = exports.createDebtsFromTransaction = exports.simplifyDebts = void 0;
const debt_model_1 = require("../models/debt.model");
const database_1 = require("../database");
const group_model_1 = require("../models/group.model");
const simplifyDebts = (debts) => __awaiter(void 0, void 0, void 0, function* () {
    // Paso 1: Crear un balance para cada miembro del grupo
    const balances = debts.reduce((acc, debt) => {
        acc[debt.creditor] = (acc[debt.creditor] || 0) + debt.amount;
        acc[debt.debtor] = (acc[debt.debtor] || 0) - debt.amount;
        return acc;
    }, {});
    // Paso 2: Encontrar el balance neto
    // (En este caso, el balance ya es neto por cómo se calculó arriba)
    // Paso 3: Crear transacciones que salden los balances netos
    // Este es un algoritmo simple y puede no ser el más eficiente
    let simplifiedDebts = [];
    for (const creditor in balances) {
        for (const debtor in balances) {
            if (balances[creditor] > 0 && balances[debtor] < 0) {
                const amount = Math.min(balances[creditor], -balances[debtor]);
                balances[creditor] -= amount;
                balances[debtor] += amount;
                if (amount > 0) {
                    simplifiedDebts.push(new debt_model_1.Debt({
                        creditor,
                        debtor,
                        amount,
                        // Aquí deberías agregar cualquier otra propiedad necesaria
                    }));
                }
            }
        }
    }
    return simplifiedDebts;
});
exports.simplifyDebts = simplifyDebts;
const createDebtsFromTransaction = (transaction, sharedWith, proposedBy) => __awaiter(void 0, void 0, void 0, function* () {
    if (!transaction || !sharedWith || sharedWith.length === 0 || !proposedBy) {
        throw new Error('Invalid parameters for creating debts.');
    }
    // Cargar la relación toGroup si aún no se ha cargado
    if (!transaction.toGroup) {
        const groupRepository = database_1.AppDataSource.getRepository(group_model_1.Group);
        const group = yield groupRepository.findOneBy({
            id: transaction.togroupid,
        });
        if (!group) {
            throw new Error('Transaction is missing a Group reference.');
        }
        transaction.toGroup = group; // Aquí sabemos que group no es null
    }
    const debtRepository = database_1.AppDataSource.getRepository(debt_model_1.Debt);
    const debtAmount = transaction.amount / sharedWith.length;
    // Crear deudas individuales
    const debtsToCreate = sharedWith
        .map((member) => {
        if (member !== proposedBy) {
            // Evita crear deudas para quien propuso la transacción
            let debt = new debt_model_1.Debt();
            debt.debtor = member; // Asegúrate de que estos valores sean cadenas
            debt.creditor = proposedBy; // Asegúrate de que estos valores sean cadenas
            debt.amount = debtAmount;
            debt.transaction = transaction;
            debt.group = transaction.toGroup; // toGroup ya es válido y existente
            debt.groupId = transaction.toGroup.id; // El ID ya es un número válido
            return debt;
        }
        return null; // Si no necesitas crear una deuda, retorna null.
    })
        .filter((debt) => debt != null); // Filtramos los valores nulos y aseguramos el tipo.
    // Guardar todas las deudas en la base de datos.
    const savedDebts = yield Promise.all(debtsToCreate.map((debt) => debtRepository.save(debt)));
    // Simplificar las deudas guardadas
    const simplifiedDebts = yield (0, exports.simplifyDebts)(savedDebts);
    return { message: 'Debts created successfully from transaction.' };
});
exports.createDebtsFromTransaction = createDebtsFromTransaction;
const createDebt = (debtInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const debtRepository = database_1.AppDataSource.getRepository(debt_model_1.Debt);
    const debt = new debt_model_1.Debt(debtInfo);
    return yield debtRepository.save(debt);
});
exports.createDebt = createDebt;
const getDebtsByGroup = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const debtRepository = database_1.AppDataSource.getRepository(debt_model_1.Debt);
    // Suponiendo que `group` es una relación a otra entidad
    return yield debtRepository.find({
        where: {
            group: { id: groupId }, // Asumiendo que `group` tiene un campo `id`
        },
    });
});
exports.getDebtsByGroup = getDebtsByGroup;
const settleDebts = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!groupId) {
        throw new Error('Group ID is required.');
    }
    // Lógica para marcar deudas como resueltas.
    // ...
    return { message: 'Debts settled successfully.' };
});
exports.settleDebts = settleDebts;
const getDebtById = (debtId) => __awaiter(void 0, void 0, void 0, function* () {
    const debtRepository = database_1.AppDataSource.getRepository(debt_model_1.Debt);
    return yield debtRepository.findOneBy({ id: debtId });
});
exports.getDebtById = getDebtById;
