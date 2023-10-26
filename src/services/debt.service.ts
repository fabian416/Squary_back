import { Debt } from '../models/debt.model';
import { AppDataSource } from '../database';

export const createDebt = async (debtInfo: any) => {
    const debt = new Debt();

    // asigna los valores de debtInfo al objeto debt
    debt.debtor = debtInfo.debtor;
    debt.creditor = debtInfo.creditor;
    debt.groupId = debtInfo.groupid;
    debt.transaction = debtInfo.transactionid;
    debt.amount = debtInfo.amount;

    const debtRepository = AppDataSource.getRepository(Debt);

    return await debtRepository.save(debt);
};

export const getDebtsByGroup = async (groupId: number) => {
    const debtRepository = AppDataSource.getRepository(Debt);


    const debts = await debtRepository
        .createQueryBuilder('debt')
        .innerJoin('debt.group', 'group')
        .where('group.id = :groupId', { groupId })
        .getMany();

    return debts;
};

export const getDebtById = async (debtId: number) => {
    const debtRepository = AppDataSource.getRepository(Debt);
    return await debtRepository.findOne({ where: { id: debtId } });
};

