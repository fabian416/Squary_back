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
exports.getUserGroups = exports.deployGnosisSafe = exports.createGroup = exports.setIo = void 0;
const group_model_1 = require("../models/group.model");
const user_model_1 = require("../models/user.model");
const pendingInvitation_model_1 = require("../models/pendingInvitation.model");
const database_1 = require("../database");
const gnosis_config_1 = require("../../gnosis.config");
let io;
const setIo = (socketIo) => {
    io = socketIo;
};
exports.setIo = setIo;
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, description, invitees, owner, signingMethod, selectedSigners, signatureThreshold } = req.body;
    if (typeof selectedSigners === 'string') {
        selectedSigners = selectedSigners.split(',');
    }
    let selectedSignersList = [];
    console.log(req.body);
    if (!['majority', 'all', 'custom'].includes(signingMethod)) {
        return res.status(400).send({ message: "Método de firma no válido." });
    }
    try {
        const user = yield database_1.AppDataSource.manager.findOne(user_model_1.User, { where: { walletAddress: owner } });
        console.log(user);
        if (!user) {
            return res.status(404).send({ message: "The user doesn't exist" });
        }
        selectedSignersList.push(user.walletAddress);
        const group = new group_model_1.Group();
        group.name = name;
        group.description = description;
        group.owner = user;
        group.members = [user];
        group.signingMethod = signingMethod;
        for (const invitee of invitees) {
            const invitedUser = yield database_1.AppDataSource.manager.findOne(user_model_1.User, { where: { walletAddress: invitee.walletAddress } });
            if (invitedUser) {
                group.members.push(invitedUser);
                selectedSignersList.push(invitedUser.walletAddress);
            }
            else {
                const newInvitation = new pendingInvitation_model_1.PendingInvitation();
                newInvitation.group = group;
                newInvitation.walletAddress = invitee.walletAddress;
                newInvitation.email = invitee.email;
                yield database_1.AppDataSource.manager.save(pendingInvitation_model_1.PendingInvitation, newInvitation);
            }
        }
        if (signingMethod === 'majority') {
            group.signatureThreshold = Math.floor(group.members.length / 2) + 1;
        }
        else if (signingMethod === 'all') {
            group.signatureThreshold = group.members.length;
        }
        else {
            group.selectedSigners = selectedSigners;
            group.signatureThreshold = signatureThreshold;
        }
        if (signingMethod !== 'custom') {
            group.selectedSigners = selectedSignersList;
        }
        const savedGroup = yield database_1.AppDataSource.manager.save(group_model_1.Group, group);
        res.status(200).send({
            message: "Grupo creado con éxito.",
            data: savedGroup,
        });
    }
    catch (error) {
        console.error("Error al guardar el grupo:", error);
        res.status(500).send({
            message: "Error al crear el grupo.",
        });
    }
});
exports.createGroup = createGroup;
const deployGnosisSafe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signedTransaction = req.body.signedTransaction;
    try {
        const txResponse = yield gnosis_config_1.provider.sendTransaction(signedTransaction);
        const receipt = yield txResponse.wait();
        const safeAddress = receipt.contractAddress;
        // const groupToUpdate = await Group.findOne(groupId); // Asume que tienes algún método para identificar qué grupo estás actualizando, como un groupId.
        //if (groupToUpdate) {
        //  groupToUpdate.status = 'active';
        //groupToUpdate.gnosissafeaddress = safeAddress;
        //await groupToUpdate.save();}
        // Aquí, puedes hacer cosas adicionales como guardar la dirección del Gnosis Safe en la base de datos
        // ...
        res.status(200).send({
            message: "Gnosis Safe desplegado con éxito.",
            safeAddress: safeAddress
        });
    }
    catch (error) {
        console.error("Error al desplegar el Gnosis Safe:", error);
        res.status(500).send({
            message: "Error al desplegar el Gnosis Safe.",
        });
    }
});
exports.deployGnosisSafe = deployGnosisSafe;
const getUserGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userWalletAddress = req.params.address;
    try {
        // Finding groups based on the owner's wallet address
        const groups = yield database_1.AppDataSource.manager.find(group_model_1.Group, { where: { owner: { walletAddress: userWalletAddress } } });
        res.status(200).send(groups);
    }
    catch (error) {
        console.error("Error al obtener los grupos:", error);
        res.status(500).send(error);
    }
});
exports.getUserGroups = getUserGroups;
