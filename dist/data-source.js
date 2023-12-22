"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_model_1 = require("./src/models/user.model");
const group_model_1 = require("./src/models/group.model");
const transaction_model_1 = require("./src/models/transaction.model");
const debt_model_1 = require("./src/models/debt.model");
const dotenv_1 = __importDefault(require("dotenv"));
const pendingInvitation_model_1 = require("./src/models/pendingInvitation.model");
const transactionsConfirmations_1 = require("./src/models/transactionsConfirmations");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
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
        user_model_1.User,
        group_model_1.Group,
        transaction_model_1.Transaction,
        pendingInvitation_model_1.PendingInvitation,
        debt_model_1.Debt,
        transactionsConfirmations_1.TransactionConfirmation,
    ],
    migrations: [
    /* paths o clases de tus migraciones */
    ],
    subscribers: [
    /* paths o clases de tus suscriptores */
    ],
});
