import { Request, Response,} from 'express';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { PendingInvitation } from '../models/pendingInvitation.model';
import { AppDataSource } from "../database"; 
import { In } from 'typeorm'; 

let io: any;

export const setIo = (socketIo: any) => {
    io = socketIo;
};
export const createGroup = async (req: Request, res: Response) => {
    let { name, description, invitees, owner, signingMethod, selected_signers, signatureThreshold } = req.body;

    const walletAddresses = invitees.map((inv: any) => inv.walletAddress);
    const allUsers = await AppDataSource.manager.find(User, { where: { walletAddress: In([owner, ...walletAddresses]) } });
    const usersByWallet = Object.fromEntries(allUsers.map(user => [user.walletAddress, user]));

    if (!usersByWallet[owner]) {
        return res.status(404).send({ message: "The user doesn't exist" });
    }

    const groupMembersSet = new Set([owner]);

    const group = new Group();
    group.name = name;
    group.description = description;
    group.owner = usersByWallet[owner];

    // Save the goup before process the pending invitations 
    const savedGroup = await AppDataSource.manager.save(Group, group);

    for (const invitee of invitees) {
        if (usersByWallet[invitee.walletAddress]) {
            groupMembersSet.add(invitee.walletAddress);
        } else if (invitee.email) {
            const newInvitation = new PendingInvitation();
            newInvitation.group = savedGroup;
            newInvitation.walletAddress = invitee.walletAddress;
            newInvitation.email = invitee.email;
            await AppDataSource.manager.save(PendingInvitation, newInvitation);
        }
    }

    group.members = [...groupMembersSet].map(wallet => usersByWallet[wallet]);
    group.signingMethod = signingMethod;
    group.selectedSigners = selected_signers;

    if (signingMethod === 'majority') {
        group.signatureThreshold = Math.floor(selected_signers.length / 2) + 1;
    } else if (signingMethod === 'all') {
        group.signatureThreshold = selected_signers.length;
    } else { // Assuming this case is 'customize'
        if (signatureThreshold >= 1 && signatureThreshold <= selected_signers.length) {
            group.signatureThreshold = signatureThreshold;
        } else {
            return res.status(400).send({ message: "The value to signatureThreshold is incorrect" });
        }
    }

    try {
        await AppDataSource.manager.save(Group, group);
        res.status(200).send({
            message: "Group created Succesfully",
            data: group,
            groupId: group.id
        });
    } catch (error) {
        console.error("Error to save the Group:", error);
        res.status(500).send({
            message: "Error to create the Group.",
        });
    }
};

export const updateGnosisSafeAddress = async (req: Request, res: Response) => {
    const { groupId, gnosissafeaddress } = req.body;

    try {
        const group = await AppDataSource.manager.findOne(Group, { where: { id: groupId } });
        
        if (!group) {
            return res.status(404).send({ message: "Group not found." });
        }

        group.gnosissafeaddress = gnosissafeaddress;
        group.status = 'active';
        
        await AppDataSource.manager.save(Group, group);

        res.status(200).send({ message: "Gnosis Safe address updated successfully." });

    } catch (error) {
        console.error("Error updating Gnosis Safe address:", error);
        res.status(500).send({ message: "Error updating Gnosis Safe address."});
    }
};


export const getUserGroups = async (req: Request, res: Response) => {
    console.log("getUserGroups called with address:", req.params.address);
    const userWalletAddress = req.params.address;

    try {
        // Usamos el mismo patrón que en otras partes del código
        const groups = await AppDataSource.manager
            .createQueryBuilder(Group, "group")
            .where("group.owner_wallet_address = :walletAddress", { walletAddress: userWalletAddress })
            .orWhere(":walletAddress = ANY(group.selected_signers)", { walletAddress: userWalletAddress })
            .getMany();

        res.status(200).send(groups);
    } catch (error) {
        console.error("Error to get the Groups:", error);
        res.status(500).send(error);
    }
};
export const getGroupMembers = async (req: Request, res: Response) => {
    const groupId = req.params.groupId;

    try {
        const members = await AppDataSource.manager
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
    } catch (error) {
        console.error("Error al obtener los miembros del grupo:", error);
        res.status(500).send(error);
    }
};


