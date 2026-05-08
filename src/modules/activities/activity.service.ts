import { ActivityRepository } from './activity.repository';
import type { ActivityWithContact, CreateActivityDto } from './activity.types';
import { AppError } from '../../shared/errors/app-error';

export class ActivityService {
  private readonly repository = new ActivityRepository();

  public async create(input: CreateActivityDto) {
    try {
      return await this.repository.create(input);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = String(error.code);
        if (code === '23503') {
          throw new AppError('Contact not found', 404);
        }
      }
      throw new AppError('Database operation failed', 500);
    }
  }

  public async search(personId: number, activityType: 'call' | 'meeting' | 'email'): Promise<ActivityWithContact[]> {
    return this.repository.searchByContactAndType(personId, activityType);
  }
}
