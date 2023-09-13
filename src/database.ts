import { DataSource } from "typeorm";
import { User } from "./models/user.model";
import { Group } from "./models/group.model";
import { Transaction } from "./models/transaction.model";
import dotenv from 'dotenv';
dotenv.config();
// ... importa tus otros modelos aquí

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: [User, Group, Transaction /*, y cualquier otro modelo*/],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source ha sido inicializado!")
    })
    .catch((err) => {
        console.error("Error durante la inicialización de Data Source", err)
    });
