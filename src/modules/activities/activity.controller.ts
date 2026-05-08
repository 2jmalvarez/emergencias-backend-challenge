import type { Request, Response } from 'express';

import { ActivityService } from './activity.service';
import type { CreateActivityDto } from './activity.types';

const getQueryString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const getQueryNumber = (value: unknown, fallback: number): number => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export class ActivityController {
  private readonly service = new ActivityService();

  public create = async (req: Request, res: Response): Promise<void> => {
    const created = await this.service.create(req.body as CreateActivityDto);
    res.status(201).json(created);
  };

  public search = async (req: Request, res: Response): Promise<void> => {
    const personId = getQueryNumber(req.query.personId, 0);
    const activityType = (getQueryString(req.query.activityType) ?? '') as
      | 'call'
      | 'meeting'
      | 'email';
    const items = await this.service.search(personId, activityType);
    res.status(200).json(items);
  };
}
