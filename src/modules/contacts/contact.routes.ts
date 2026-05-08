import { Router } from 'express';

import { ContactController } from './contact.controller';
import {
  byEmailSchema,
  byIdSchema,
  byPhoneSchema,
  createContactSchema,
  searchContactsSchema,
  updateContactSchema,
} from './contact.schemas';

import { validateRequest } from '../../shared/middleware/validate-request';

const router = Router();
const controller = new ContactController();

router.post('/', validateRequest(createContactSchema), controller.create);
router.get('/by-email', validateRequest(byEmailSchema), controller.byEmail);
router.get('/search', validateRequest(searchContactsSchema), controller.search);
router.get('/by-phone', validateRequest(byPhoneSchema), controller.byPhone);
router.patch('/:id', validateRequest(updateContactSchema), controller.update);
router.delete('/:id', validateRequest(byIdSchema), controller.delete);

export { router as contactRoutes };
