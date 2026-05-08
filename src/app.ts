import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { openApiDocument } from './docs/openapi';
import { activityRoutes } from './modules/activities/activity.routes';
import { contactRoutes } from './modules/contacts/contact.routes';
import { errorHandler } from './shared/errors/error-handler.middleware';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use('/contacts', contactRoutes);
app.use('/activities', activityRoutes);

app.use(errorHandler);
