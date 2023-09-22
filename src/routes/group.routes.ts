import { Router } from 'express';
import * as groupController from '../controllers/group.controller';
import { deployGnosisSafe } from '../controllers/group.controller';

const router = Router();

router.post('/create', groupController.createGroup);
router.get('/:address/groups', groupController.getUserGroups);
router.post('/api/gnosis/deploy', deployGnosisSafe);


export default router;
