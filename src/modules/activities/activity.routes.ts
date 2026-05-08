import { Router } from 'express';

import { ActivityController } from './activity.controller';
import { createActivitySchema, searchActivitiesSchema } from './activity.schemas';
import { validateRequest } from '../../shared/middleware/validate-request';

const router = Router();
const controller = new ActivityController();

router.post('/', validateRequest(createActivitySchema), controller.create);
router.get('/search', validateRequest(searchActivitiesSchema), controller.search);

export { router as activityRoutes };
