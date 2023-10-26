import { Request, Response } from 'express';
import * as DebtService from '../services/debt.service';

export const createDebt = async (req: Request, res: Response): Promise<Response> => {
    try {
        const debtInfo = req.body;
        const newDebt = await DebtService.createDebt(debtInfo);
        return res.json(newDebt);
    } catch (error) {
        const errorMessage = (error as Error).message;
        return res.status(500).json({ message: "Error al crear la deuda", error: errorMessage });
    }
};

export const getDebtsByGroup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        const debts = await DebtService.getDebtsByGroup(groupId);
        return res.json(debts);
    } catch (error) {
        const errorMessage = (error as Error).message;
        return res.status(500).json({ message: "Error al obtener las deudas del grupo", error: errorMessage });
    }
};

export const getDebtById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const debtId = parseInt(req.params.debtId, 10);
        const debt = await DebtService.getDebtById(debtId);
        if (debt) {
            return res.json(debt);
        } else {
            return res.status(404).json({ message: "Deuda no encontrada" });
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        return res.status(500).json({ message: "Error al obtener la deuda", error: errorMessage });
    }
};

