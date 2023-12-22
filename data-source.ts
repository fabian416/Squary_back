import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/models/user.model';
import { Group } from './src/models/group.model';
import { Transaction } from './src/models/transaction.model';
import { Debt } from './src/models/debt.model';
import dotenv from 'dotenv';
import { PendingInvitation } from './src/models/pendingInvitation.model';
import { TransactionConfirmation } from './src/models/transactionsConfirmations';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true,
  logging: true,
  logger: 'advanced-console',
  entities: [
    User,
    Group,
    Transaction,
    PendingInvitation,
    Debt,
    TransactionConfirmation,
  ],
  migrations: [
    /* paths o clases de tus migraciones */
  ],
  subscribers: [
    /* paths o clases de tus suscriptores */
  ],
});
