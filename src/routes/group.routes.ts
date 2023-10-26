import { Router } from 'express';
import * as groupController from '../controllers/group.controller';

const router = Router();

router.post('/create', groupController.createGroup);
router.post('/updateGnosisAddress', groupController.updateGnosisSafeAddress);
router.get('/getUserGroups/:address', groupController.getUserGroups);
router.get('/:groupId/members', groupController.getGroupMembers);

export default router;
