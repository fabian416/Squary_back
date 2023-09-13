import { Router } from 'express';
import * as groupController from '../controllers/group.controller';

const router = Router();

router.post('/create', groupController.createGroup);
router.get('/:address/groups', groupController.getUserGroups);
// Añade más rutas según lo necesites: obtener grupos, actualizar grupos, eliminar grupos, etc.

export default router;
