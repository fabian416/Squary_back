import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import * as DebtService from '../services/debt.service';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { TransactionConfirmation } from '../models/transactionsConfirmations';
import { AppDataSource } from '../../data-source';
import { Not } from 'typeorm';

let io: any;

export const setIo = (socketIo: any) => {
  io = socketIo;
};
export const createTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { amount, description, proposedBy, sharedWith, type, groupId } =
      req.body;

    // Validación de campos requeridos
    if (
      !amount ||
      !description ||
      !proposedBy ||
      !sharedWith ||
      !type ||
      !groupId
    ) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Validación del grupo
    const numGroupId = Number(groupId);
    const group = await Group.findOne({ where: { id: numGroupId } });

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    // Crear la transacción
    let newTransaction = new Transaction();
    newTransaction.amount = amount;
    newTransaction.description = description;
    newTransaction.proposedby = proposedBy;
    newTransaction.sharedWith = sharedWith;
    newTransaction.type = type;
    newTransaction.togroupid = groupId;
    console.log('Group ID:', groupId);
    console.log('Transaction before saving:', newTransaction);

    newTransaction = await newTransaction.save();

    // Lógica para crear deudas (si es necesario)
    if (type === 'EXPENSE') {
      await DebtService.createDebtsFromTransaction(
        newTransaction,
        sharedWith,
        proposedBy
      );
    }

    return res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getTransactionsByGroup = async (req: Request, res: Response) => {
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
    const transactions = await Transaction.find({
      where: {
        togroupid: numGroupId,
        type: Not('SETTLEMENT' as any),
      },
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions for group:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Transaction ID is required.' });
  }

  try {
    const transaction = await Transaction.findOne({
      where: { id: Number(id) },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const settleSpecialTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { groupId, amount, description } = req.body;

    // Validación básica de los campos
    if (!groupId || !amount || !description) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Encuentra el grupo asociado
    const group = await Group.findOne({ where: { id: groupId } });
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    // Crear la transacción de asentamiento
    let settlementTransaction = new Transaction();
    settlementTransaction.amount = amount;
    settlementTransaction.description = `Settlement executed at ${new Date().toISOString()}`;
    settlementTransaction.togroupid = groupId;
    settlementTransaction.type = 'SETTLEMENT';

    // Guardar la transacción de asentamiento
    settlementTransaction = await settlementTransaction.save();

    const relatedTransactions = await Transaction.find({
      where: { togroupid: groupId, includedInSettlement: false },
    });
    relatedTransactions.forEach(async (tx) => {
      tx.includedInSettlement = true;
      await tx.save();
    });

    // Actualizar el estado de asentamiento del grupo
    group.settleCompleted = true;
    await group.save();

    return res.status(201).json(settlementTransaction);
  } catch (error) {
    console.error('Error creating settlement transaction:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getSettlementTransactions = async (
  req: Request,
  res: Response
) => {
  const groupId = parseInt(req.params.groupId);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  const transactions = await Transaction.find({
    where: {
      togroupid: groupId,
      type: 'SETTLEMENT',
    },
  });

  return res.status(200).json(transactions);
};

export const getSettlementTransactionsByGroup = async (
  req: Request,
  res: Response
) => {
  const groupId = parseInt(req.params.groupId, 10);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  try {
    // Buscar transacciones de asentamiento para el grupo especificado
    const settlements = await Transaction.find({
      where: { togroupid: groupId, type: 'SETTLEMENT' },
    });

    res.status(200).json(settlements);
  } catch (error) {
    console.error('Error fetching settlement transactions for group:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  const id = req.params.id; // Asumiendo que recibes el id como parámetro de ruta
  const transactionId = Number(id); // Convertir la cadena a número

  try {
    const transaction = await Transaction.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    // Aquí, puedes proceder a actualizar los campos de la transacción como lo necesites.
    // Por ejemplo:
    // transaction.amount = req.body.amount;
    // await transaction.save();

    return res.status(200).json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Transaction ID is required.' });
  }

  try {
    const transactionId = Number(id);
    const transaction = await Transaction.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    await Transaction.remove(transaction);
    return res
      .status(200)
      .json({ message: 'Transaction deleted successfully.' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find();

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Iniciar una confirmación de asentamiento
export const initiateSettlementConfirmation = async (
  req: Request,
  res: Response
) => {
  const groupId = parseInt(req.params.groupId, 10);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  try {
    const group = await Group.findOne({ where: { id: groupId } });

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const existingConfirmations = await TransactionConfirmation.find({
      where: { group: { id: groupId } },
    });

    // Verifica si el asentamiento anterior ha sido completado
    if (existingConfirmations.length > 0 && !group.settleCompleted) {
      return res
        .status(400)
        .json({ message: 'Settlement process is already in progress.' });
    }

    // Resetear o eliminar las confirmaciones existentes
    await TransactionConfirmation.delete({ group: { id: groupId } });

    // Establecer settleCompleted en false para indicar que el proceso de asentamiento ha comenzado
    group.settleCompleted = false;
    await group.save();

    // Crear una confirmación para cada miembro del grupo
    group.selectedSigners.forEach(async (memberAddress: string) => {
      const newConfirmation = new TransactionConfirmation();
      newConfirmation.group = group;
      newConfirmation.userWalletAddress = memberAddress;
      await newConfirmation.save();
    });

    res
      .status(200)
      .json({ message: 'Settlement confirmation initiated successfully.' });
  } catch (error) {
    console.error('Error initiating settlement confirmation:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Confirmar asentamiento
export const confirmSettlement = async (req: Request, res: Response) => {
  const groupId = parseInt(req.params.groupId, 10);
  const userWalletAddress = req.body.userWalletAddress;

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  try {
    const confirmation = await TransactionConfirmation.findOne({
      where: {
        group: { id: groupId },
        userWalletAddress: userWalletAddress,
      },
    });

    if (confirmation) {
      confirmation.confirmed = true;
      await confirmation.save();
      return res
        .status(200)
        .json({ message: 'Settlement confirmed successfully.' });
    }
    return res.status(404).json({ message: 'Confirmation not found.' });
  } catch (error) {
    console.error('Error confirming settlement:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Obtener confirmaciones de asentamiento
export const getSettlementConfirmations = async (
  req: Request,
  res: Response
) => {
  const groupId = parseInt(req.params.groupId, 10);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  try {
    const confirmations = await TransactionConfirmation.find({
      where: { group: { id: groupId } },
      relations: ['group', 'user'],
    });
    return res.status(200).json(confirmations);
  } catch (error) {
    console.error('Error getting settlement confirmations:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
export const getSettleStatus = async (req: Request, res: Response) => {
  const groupId = parseInt(req.params.groupId, 10);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  try {
    const group = await Group.findOne({ where: { id: groupId } });
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const confirmations = await TransactionConfirmation.find({
      where: { group: { id: groupId }, confirmed: true },
    });

    const isInitiated = confirmations.length > 0;
    const isConfirmed = confirmations.length >= group.signatureThreshold;

    res.json({ initiated: isInitiated, confirmed: isConfirmed });
  } catch (error) {
    console.error('Error getting settle status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const resetSettle = async (req: Request, res: Response) => {
  const groupId = parseInt(req.params.groupId, 10);

  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid group ID.' });
  }

  try {
    // Verificar si el grupo existe

    const group = await Group.findOne({ where: { id: groupId } });

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    // Resetear el estado de las confirmaciones a 'false'
    await TransactionConfirmation.update(
      { group: { id: groupId } },
      { confirmed: false }
    );

    res.status(200).json({ message: 'Settlement state reset successfully.' });
  } catch (error) {
    console.error('Error resetting settlement state:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
