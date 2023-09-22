import "reflect-metadata";
import dotenv from 'dotenv';
import { DataSource } from "typeorm";
import { User } from "./models/user.model";
import { Group } from "./models/group.model";
import { Transaction } from "./models/transaction.model";
import { PendingInvitation } from "./models/pendingInvitation.model";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: [User, Group, Transaction, PendingInvitation ],
    logging: true 
});

AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source ha sido inicializado!")
        
        const currentDb = await AppDataSource.query("SELECT current_database();");
        console.log("Conectado a la base de datos:", currentDb[0].current_database); // Deberías acceder al primer resultado y a la propiedad correcta.
    })
    .catch((err) => {
        console.error("Error durante la inicialización de Data Source", err)
    });
