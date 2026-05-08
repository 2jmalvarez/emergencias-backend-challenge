import type { Request, Response } from 'express';

import { createActivitySchema, searchActivitiesSchema } from './activity.schemas';
import { ActivityService } from './activity.service';

import { sendSuccess } from '../../shared/http/api-response';

export class ActivityController {
  private readonly service = new ActivityService();

  public create = async (req: Request, res: Response): Promise<void> => {
    const { body } = createActivitySchema.parse({ body: req.body });
    const created = await this.service.create(body);
    sendSuccess(res, 201, created);
  };

  public search = async (req: Request, res: Response): Promise<void> => {
    const { query } = searchActivitiesSchema.parse({ query: req.query });
    const items = await this.service.search(query.personId, query.activityType);
    sendSuccess(res, 200, items);
  };
}
