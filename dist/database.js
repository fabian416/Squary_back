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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const user_model_1 = require("./models/user.model");
const group_model_1 = require("./models/group.model");
const transaction_model_1 = require("./models/transaction.model");
const debt_model_1 = require("./models/debt.model");
const pendingInvitation_model_1 = require("./models/pendingInvitation.model");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: [user_model_1.User, group_model_1.Group, transaction_model_1.Transaction, pendingInvitation_model_1.PendingInvitation, debt_model_1.Debt],
    logging: true
});
exports.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Data Source ha sido inicializado!");
    const currentDb = yield exports.AppDataSource.query("SELECT current_database();");
    console.log("Conectado a la base de datos:", currentDb[0].current_database); // You should access the first result and the correct property.
}))
    .catch((err) => {
    console.error("Error durante la inicialización de Data Source", err);
});
