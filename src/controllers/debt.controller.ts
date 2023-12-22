import { Request, Response } from 'express';
import { Debt } from '../models/debt.model';
import * as DebtService from '../services/debt.service';

export const createDebt = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const debtInfo = req.body;
    console.log('Request Data for Create Debt:', debtInfo); // Agregar registro de solicitud
    const newDebt = await DebtService.createDebt(debtInfo);
    console.log('New Debt Created:', newDebt); // Agregar registro de la nueva deuda creada
    return res.json(newDebt);
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log('Error Creating Debt:', errorMessage); // Agregar registro de error
    return res
      .status(500)
      .json({ message: 'Error al crear la deuda', error: errorMessage });
  }
};

export const getDebtsByGroup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    console.log('Group ID for Get Debts:', groupId); // Agregar registro del ID de grupo
    const debts = await DebtService.getDebtsByGroup(groupId);
    console.log('Debts Retrieved:', debts); // Agregar registro de deudas recuperadas
    return res.json(debts);
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log('Error Getting Debts:', errorMessage); // Agregar registro de error
    return res.status(500).json({
      message: 'Error al obtener las deudas del grupo',
      error: errorMessage,
    });
  }
};

export const getUnsettledDebtsByGroup = async (req: Request, res: Response) => {
  const groupId = parseInt(req.params.groupId, 10);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  try {
    const debts = await Debt.find({
      where: {
        group: { id: groupId },
        transaction: { includedInSettlement: false },
      },
      relations: ['transaction'], // Asegúrate de incluir la relación aquí
    });
    const simplifiedDebts = await DebtService.simplifyDebts(debts);
    res.json(simplifiedDebts);
  } catch (error) {
    console.error('Error fetching unsettled debts for group:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getDebtById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const debtId = parseInt(req.params.debtId, 10);
    console.log('Debt ID for Get Debt:', debtId); // Agregar registro del ID de deuda
    const debt = await DebtService.getDebtById(debtId);
    if (debt) {
      console.log('Debt Retrieved:', debt); // Agregar registro de deuda recuperada
      return res.json(debt);
    } else {
      return res.status(404).json({ message: 'Deuda no encontrada' });
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log('Error Getting Debt:', errorMessage); // Agregar registro de error
    return res
      .status(500)
      .json({ message: 'Error al obtener la deuda', error: errorMessage });
  }
};

export const settleDebtsController = async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.body.groupId, 10);
    console.log('Group ID for Settle Debts:', groupId); // Agregar registro del ID de grupo
    const result = await DebtService.settleDebts(groupId);
    console.log('Settlement Result:', result); // Agregar registro del resultado del proceso de conciliación
    return res.status(200).json(result);
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log('Error Settling Debts:', errorMessage); // Agregar registro de error
    return res.status(500).json({ message: errorMessage });
  }
};
