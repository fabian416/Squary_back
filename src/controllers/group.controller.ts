import { Request, Response } from 'express';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { AppDataSource } from "../database"; 

let io: any;

export const setIo = (socketIo: any) => {
    io = socketIo;
};

export const createGroup = async (req: Request, res: Response) => {
    const { name, description, type, ownerWalletAddress } = req.body;

    try {
        // Look for the user by his wallet address
        const user = await AppDataSource.manager.findOne(User, { where: { walletAddress: ownerWalletAddress } });

        // If the user doesn't exist, send an error
        if (!user) {
            return res.status(404).send({ message: "The user doesn't exist" });
        }

        // Create a new group instance
        const group = new Group();
        group.name = name;
        group.description = description;
        group.owner = user;

        const savedGroup = await AppDataSource.manager.save(Group, group);

        res.status(200).send({
            message: "El grupo se creó con éxito.",
            data: savedGroup
        });
    } catch (error) {
        console.error("Error al guardar el grupo:", error);
        res.status(500).send({
            message: "Error al crear el grupo.",
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
