const { DataSource } = require('@typeorm/datasource');
const path = require('path');
require('dotenv').config();

const mainConnectionOptions = {
    name: 'default',
    type: "postgres",
    host: process.env.PG_HOST,
    port: +process.env.PG_PORT,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: false,
    entities: [path.join(__dirname, "dist", "models", "*.js")],
    migrations: [path.join(__dirname, "dist", "migrations", "*.js")],
    subscribers: [path.join(__dirname, "dist", "subscribers", "*.js")],
    cli: {
        entitiesDir: path.join(__dirname, "dist", "models"),
        migrationsDir: path.join(__dirname, "dist", "migrations"),
        subscribersDir: path.join(__dirname, "dist", "subscribers")
    }
};

const dataSource = new DataSource([mainConnectionOptions]);

module.exports = dataSource;
