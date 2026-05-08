import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { openApiDocument } from './docs/openapi';
import { activityRoutes } from './modules/activities/activity.routes';
import { contactRoutes } from './modules/contacts/contact.routes';
import { errorHandler } from './shared/errors/error-handler.middleware';
import { sendSuccess } from './shared/http/api-response';
import { httpLogger } from './shared/logging/http-logger';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.get('/health', (_req, res) => {
  sendSuccess(res, 200, { status: 'ok' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use('/contacts', contactRoutes);
app.use('/activities', activityRoutes);

app.use(errorHandler);
