import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.get('/aliases-to-addresses', userController.getWalletAddressesByAliases)

export default router;
