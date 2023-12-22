import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.get('/aliases-to-addresses', userController.getWalletAddressesByAliases);
router.get('/addresses-to-aliases', userController.getAliasesByWalletAddresses);

export default router;
