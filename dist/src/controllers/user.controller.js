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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletAddressesByAliases = exports.register = exports.authenticate = exports.setIo = void 0;
const user_model_1 = require("../models/user.model");
const database_1 = require("../database");
const typeorm_1 = require("typeorm");
let io;
const isAliasFormatCorrect = (alias) => {
    return alias.startsWith("@") && alias.length > 3;
};
const setIo = (socketIo) => {
    io = socketIo;
};
exports.setIo = setIo;
const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.body;
    try {
        const user = yield database_1.AppDataSource.manager.findOne(user_model_1.User, { where: { walletAddress: walletAddress } });
        if (user) {
            res.status(200).send({ message: 'Usuario autenticado exitosamente', user: user });
        }
        else {
            res.status(200).send({ message: 'Usuario no registrado', user: null });
        }
    }
    catch (err) {
        console.error("Error al registrar usuario:", err);
        res.status(500).send(err);
    }
});
exports.authenticate = authenticate;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, alias, email } = req.body;
    if (!walletAddress || !alias) {
        return res.status(400).send({ message: 'Los campos walletAddress y alias son obligatorios.' });
    }
    // check de alias format
    if (!isAliasFormatCorrect(alias)) {
        return res.status(400).send({ message: 'El formato del alias es incorrecto.' });
    }
    try {
        let user = yield database_1.AppDataSource.manager.findOne(user_model_1.User, { where: { walletAddress: walletAddress } });
        if (!user) {
            user = new user_model_1.User();
            user.walletAddress = walletAddress;
            user.alias = alias;
            user.email = email;
            yield database_1.AppDataSource.manager.save(user_model_1.User, user);
            res.status(201).send({ message: 'Usuario registrado exitosamente', user: user });
        }
        else {
            res.status(400).send({ message: 'El usuario ya existe' });
        }
    }
    catch (err) {
        console.error("Error al registrar el usuario:", err);
        next(err);
    }
});
exports.register = register;
const getWalletAddressesByAliases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const aliases = req.query.aliases;
    if (!aliases || !aliases.length) {
        return res.status(400).send({ error: "No se proporcionaron alias." });
    }
    // Validar cada alias
    for (const alias of aliases) {
        if (!isAliasFormatCorrect(alias)) {
            return res.status(400).send({ message: `El formato del alias ${alias} es incorrecto.` });
        }
    }
    try {
        const users = yield user_model_1.User.find({ where: { alias: (0, typeorm_1.In)(aliases) } });
        const result = {};
        for (const user of users) {
            result[user.alias] = user.walletAddress;
        }
        return res.send(result);
    }
    catch (error) {
        console.error("Error al obtener direcciones de billetera:", error);
        return res.status(500).send({ error: "Error del servidor." });
    }
});
exports.getWalletAddressesByAliases = getWalletAddressesByAliases;
