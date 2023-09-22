import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppDataSource } from "../database"; 
import { In } from 'typeorm';
let io: any;

const isAliasFormatCorrect = (alias: string) => {
    return alias.startsWith("@") && alias.length > 3;
};

export const setIo = (socketIo: any) => {
    io = socketIo;
};

export const authenticate = async (req: Request, res: Response) => {
    const { walletAddress } = req.body;

    try {
        const user = await AppDataSource.manager.findOne(User, { where: { walletAddress: walletAddress } });
        
        if (user) {
            res.status(200).send({ message: 'Usuario autenticado exitosamente', user: user });
        } else {
            res.status(200).send({ message: 'Usuario no registrado', user: null });
        }
    } catch (err) {
        console.error("Error al registrar usuario:", err);
        res.status(500).send(err);
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { walletAddress, alias, email } = req.body;

    if (!walletAddress || !alias) {
        return res.status(400).send({ message: 'Los campos walletAddress y alias son obligatorios.' });
    }
     // check de alias format
     if (!isAliasFormatCorrect(alias)) {
        return res.status(400).send({ message: 'El formato del alias es incorrecto.' });
    }

    try {
        let user = await AppDataSource.manager.findOne(User, { where: { walletAddress: walletAddress } });

        if (!user) {
            user = new User();
            user.walletAddress = walletAddress;
            user.alias = alias;
            user.email = email;
            await AppDataSource.manager.save(User, user);
            res.status(201).send({ message: 'Usuario registrado exitosamente', user: user });
        } else {
            res.status(400).send({ message: 'El usuario ya existe' });
        }
    } catch (err) {
        console.error("Error al registrar el usuario:", err);
        next(err);
    }
};

export const getWalletAddressesByAliases = async (req: Request, res: Response) => {
    const aliases = req.query.aliases as string[];

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
        
        const users = await User.find({ where: { alias: In(aliases) } });
        const result: Record<string, string> = {};

        for (const user of users) {
            result[user.alias] = user.walletAddress;
        }

        return res.send(result);
    } catch (error) {
        console.error("Error al obtener direcciones de billetera:", error);
        return res.status(500).send({ error: "Error del servidor." });
    }
};



