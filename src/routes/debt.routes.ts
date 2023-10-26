import { Router } from 'express';
import * as DebtController from '../controllers/debt.controller';

const router =  Router();

router.post('/', DebtController.createDebt);  
router.get('/groups/:groupId', DebtController.getDebtsByGroup);  
router.get('/:debtId', DebtController.getDebtById);  

export default router;