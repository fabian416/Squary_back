import { Request, Response,} from 'express';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { PendingInvitation } from '../models/pendingInvitation.model';
import { AppDataSource } from "../database"; 
import { getEthersAdapter, provider } from '../../gnosis.config';
import { SafeFactory } from '@safe-global/protocol-kit';

let io: any;

export const setIo = (socketIo: any) => {
    io = socketIo;
};

export const createGroup = async (req: Request, res: Response) => {
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
        const user = await AppDataSource.manager.findOne(User, { where: { walletAddress: owner } });
        console.log(user);
        if (!user) {
            return res.status(404).send({ message: "The user doesn't exist" });
        }
        selectedSignersList.push(user.walletAddress);

        const group = new Group();
        group.name = name;
        group.description = description;
        group.owner = user;
        group.members = [user];
        group.signingMethod = signingMethod;

        for (const invitee of invitees) {
            const invitedUser = await AppDataSource.manager.findOne(User, { where: { walletAddress: invitee.walletAddress } });
            if (invitedUser) {
                group.members.push(invitedUser);
                selectedSignersList.push(invitedUser.walletAddress);
            } else {
                const newInvitation = new PendingInvitation();
                newInvitation.group = group;
                newInvitation.walletAddress = invitee.walletAddress;
                newInvitation.email = invitee.email;
                await AppDataSource.manager.save(PendingInvitation, newInvitation);
            }
        }

        if (signingMethod === 'majority') {
            group.signatureThreshold = Math.floor(group.members.length / 2) + 1;
        } else if (signingMethod === 'all') {
            group.signatureThreshold = group.members.length;
        } else {
            group.selectedSigners = selectedSigners;
            group.signatureThreshold = signatureThreshold;
        }
        
        if (signingMethod !== 'custom') {
            group.selectedSigners = selectedSignersList;
        }

        const savedGroup = await AppDataSource.manager.save(Group, group);

        res.status(200).send({
            message: "Grupo creado con éxito.",
            data: savedGroup,
        });

    } catch (error) {
        console.error("Error al guardar el grupo:", error);
        res.status(500).send({
            message: "Error al crear el grupo.",
        });
    }
};

export const deployGnosisSafe = async (req: Request, res: Response) => {
    const signedTransaction = req.body.signedTransaction;

    try {
        const txResponse = await provider.sendTransaction(signedTransaction);
        const receipt = await txResponse.wait();
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
    } catch (error) {
        console.error("Error al desplegar el Gnosis Safe:", error);
        res.status(500).send({
            message: "Error al desplegar el Gnosis Safe.",
        });
    }
};

export const getUserGroups = async (req: Request, res: Response) => {
    const userWalletAddress = req.params.address;

    try {
        // Finding groups based on the owner's wallet address
        const groups = await AppDataSource.manager.find(Group, { where: { owner: { walletAddress: userWalletAddress } } });

        res.status(200).send(groups);
    } catch (error) {
        console.error("Error al obtener los grupos:", error);
        res.status(500).send(error);
    }
};
