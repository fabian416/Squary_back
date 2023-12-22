import { Debt } from '../models/debt.model';
import { AppDataSource } from '../database';
import { Transaction } from '../models/transaction.model';
import { Group } from '../models/group.model';

type Balances = {
  [key: string]: number;
};

export const simplifyDebts = async (debts: Debt[]): Promise<Debt[]> => {
  // Paso 1: Crear un balance para cada miembro del grupo
  const balances: Balances = debts.reduce((acc, debt) => {
    acc[debt.creditor] = (acc[debt.creditor] || 0) + debt.amount;
    acc[debt.debtor] = (acc[debt.debtor] || 0) - debt.amount;
    return acc;
  }, {} as Balances);

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
          simplifiedDebts.push(
            new Debt({
              creditor,
              debtor,
              amount,
              // Aquí deberías agregar cualquier otra propiedad necesaria
            })
          );
        }
      }
    }
  }

  return simplifiedDebts;
};

export const createDebtsFromTransaction = async (
  transaction: Transaction,
  sharedWith: string[],
  proposedBy: string
): Promise<{ message: string }> => {
  if (!transaction || !sharedWith || sharedWith.length === 0 || !proposedBy) {
    throw new Error('Invalid parameters for creating debts.');
  }

  // Cargar la relación toGroup si aún no se ha cargado
  if (!transaction.toGroup) {
    const groupRepository = AppDataSource.getRepository(Group);
    const group = await groupRepository.findOneBy({
      id: transaction.togroupid,
    });
    if (!group) {
      throw new Error('Transaction is missing a Group reference.');
    }
    transaction.toGroup = group; // Aquí sabemos que group no es null
  }

  const debtRepository = AppDataSource.getRepository(Debt);
  const debtAmount = transaction.amount / sharedWith.length;

  // Crear deudas individuales
  const debtsToCreate: Debt[] = sharedWith
    .map((member) => {
      if (member !== proposedBy) {
        // Evita crear deudas para quien propuso la transacción
        let debt = new Debt();
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
    .filter((debt) => debt != null) as Debt[]; // Filtramos los valores nulos y aseguramos el tipo.

  // Guardar todas las deudas en la base de datos.
  const savedDebts = await Promise.all(
    debtsToCreate.map((debt) => debtRepository.save(debt))
  );

  // Simplificar las deudas guardadas
  const simplifiedDebts = await simplifyDebts(savedDebts);

  return { message: 'Debts created successfully from transaction.' };
};

export const createDebt = async (debtInfo: any): Promise<Debt> => {
  const debtRepository = AppDataSource.getRepository(Debt);
  const debt = new Debt(debtInfo);
  return await debtRepository.save(debt);
};

export const getDebtsByGroup = async (groupId: number): Promise<Debt[]> => {
  const debtRepository = AppDataSource.getRepository(Debt);
  // Suponiendo que `group` es una relación a otra entidad
  return await debtRepository.find({
    where: {
      group: { id: groupId }, // Asumiendo que `group` tiene un campo `id`
    },
  });
};

export const settleDebts = async (
  groupId: number
): Promise<{ message: string }> => {
  if (!groupId) {
    throw new Error('Group ID is required.');
  }
  // Lógica para marcar deudas como resueltas.
  // ...
  return { message: 'Debts settled successfully.' };
};

export const getDebtById = async (debtId: number): Promise<Debt | null> => {
  const debtRepository = AppDataSource.getRepository(Debt);
  return await debtRepository.findOneBy({ id: debtId });
};
