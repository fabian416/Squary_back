"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./models/user.model");
const group_model_1 = require("./models/group.model");
const transaction_model_1 = require("./models/transaction.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ... importa tus otros modelos aquí
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: [user_model_1.User, group_model_1.Group, transaction_model_1.Transaction /*, y cualquier otro modelo*/],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source ha sido inicializado!");
})
    .catch((err) => {
    console.error("Error durante la inicialización de Data Source", err);
});
