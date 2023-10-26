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
exports.getGroupMembers = exports.getUserGroups = exports.updateGnosisSafeAddress = exports.createGroup = exports.setIo = void 0;
const group_model_1 = require("../models/group.model");
const user_model_1 = require("../models/user.model");
const pendingInvitation_model_1 = require("../models/pendingInvitation.model");
const database_1 = require("../database");
const typeorm_1 = require("typeorm");
let io;
const setIo = (socketIo) => {
    io = socketIo;
};
exports.setIo = setIo;
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, description, invitees, owner, signingMethod, selected_signers, signatureThreshold } = req.body;
    const walletAddresses = invitees.map((inv) => inv.walletAddress);
    const allUsers = yield database_1.AppDataSource.manager.find(user_model_1.User, { where: { walletAddress: (0, typeorm_1.In)([owner, ...walletAddresses]) } });
    const usersByWallet = Object.fromEntries(allUsers.map(user => [user.walletAddress, user]));
    if (!usersByWallet[owner]) {
        return res.status(404).send({ message: "The user doesn't exist" });
    }
    const groupMembersSet = new Set([owner]);
    const group = new group_model_1.Group();
    group.name = name;
    group.description = description;
    group.owner = usersByWallet[owner];
    // Save the goup before process the pending invitations 
    const savedGroup = yield database_1.AppDataSource.manager.save(group_model_1.Group, group);
    for (const invitee of invitees) {
        if (usersByWallet[invitee.walletAddress]) {
            groupMembersSet.add(invitee.walletAddress);
        }
        else if (invitee.email) {
            const newInvitation = new pendingInvitation_model_1.PendingInvitation();
            newInvitation.group = savedGroup;
            newInvitation.walletAddress = invitee.walletAddress;
            newInvitation.email = invitee.email;
            yield database_1.AppDataSource.manager.save(pendingInvitation_model_1.PendingInvitation, newInvitation);
        }
    }
    group.members = [...groupMembersSet].map(wallet => usersByWallet[wallet]);
    group.signingMethod = signingMethod;
    group.selectedSigners = selected_signers;
    if (signingMethod === 'majority') {
        group.signatureThreshold = Math.floor(selected_signers.length / 2) + 1;
    }
    else if (signingMethod === 'all') {
        group.signatureThreshold = selected_signers.length;
    }
    else { // Assuming this case is 'customize'
        if (signatureThreshold >= 1 && signatureThreshold <= selected_signers.length) {
            group.signatureThreshold = signatureThreshold;
        }
        else {
            return res.status(400).send({ message: "The value to signatureThreshold is incorrect" });
        }
    }
    try {
        yield database_1.AppDataSource.manager.save(group_model_1.Group, group);
        res.status(200).send({
            message: "Group created Succesfully",
            data: group,
            groupId: group.id
        });
    }
    catch (error) {
        console.error("Error to save the Group:", error);
        res.status(500).send({
            message: "Error to create the Group.",
        });
    }
});
exports.createGroup = createGroup;
const updateGnosisSafeAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, gnosissafeaddress } = req.body;
    try {
        const group = yield database_1.AppDataSource.manager.findOne(group_model_1.Group, { where: { id: groupId } });
        if (!group) {
            return res.status(404).send({ message: "Group not found." });
        }
        group.gnosissafeaddress = gnosissafeaddress;
        group.status = 'active';
        yield database_1.AppDataSource.manager.save(group_model_1.Group, group);
        res.status(200).send({ message: "Gnosis Safe address updated successfully." });
    }
    catch (error) {
        console.error("Error updating Gnosis Safe address:", error);
        res.status(500).send({ message: "Error updating Gnosis Safe address." });
    }
});
exports.updateGnosisSafeAddress = updateGnosisSafeAddress;
const getUserGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getUserGroups called with address:", req.params.address);
    const userWalletAddress = req.params.address;
    try {
        // Usamos el mismo patrón que en otras partes del código
        const groups = yield database_1.AppDataSource.manager
            .createQueryBuilder(group_model_1.Group, "group")
            .where("group.owner_wallet_address = :walletAddress", { walletAddress: userWalletAddress })
            .orWhere(":walletAddress = ANY(group.selected_signers)", { walletAddress: userWalletAddress })
            .getMany();
        res.status(200).send(groups);
    }
    catch (error) {
        console.error("Error to get the Groups:", error);
        res.status(500).send(error);
    }
});
exports.getUserGroups = getUserGroups;
const getGroupMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    try {
        const members = yield database_1.AppDataSource.manager
            .createQueryBuilder("users", "u")
            .innerJoin("groups", "g", "u.walletAddress = ANY(g.selected_signers)")
            .where("g.id = :groupId", { groupId })
            .select(["u.walletAddress", "u.alias"])
            .getRawMany();
        // Adapt the struct of members
        const adaptedMembers = members.map(member => ({
            walletAddress: member.u_walletAddress,
            alias: member.u_alias
        }));
        res.status(200).send(adaptedMembers);
    }
    catch (error) {
        console.error("Error al obtener los miembros del grupo:", error);
        res.status(500).send(error);
    }
});
exports.getGroupMembers = getGroupMembers;
