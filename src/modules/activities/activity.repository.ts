import type { ActivityWithContact, CreateActivityDto } from './activity.types';
import { pool } from '../../config/db';
import { createSqlLoader } from '../../shared/utils/sql-loader';

const sql = createSqlLoader(__dirname);

type CreatedActivity = {
  id: number;
  personId: number;
  activityType: 'call' | 'meeting' | 'email';
  activityDate: string;
  description: string | null;
};

export class ActivityRepository {
  public async create(input: CreateActivityDto): Promise<CreatedActivity> {
    const result = await pool.query<CreatedActivity>(
      sql('create-activity.sql'),
      [input.personId, input.activityType, input.activityDate, input.description ?? null],
    );

    return result.rows[0];
  }

  public async searchByContactAndType(
    personId: number,
    activityType: 'call' | 'meeting' | 'email',
  ): Promise<ActivityWithContact[]> {
    const result = await pool.query<ActivityWithContact>(sql('search-activities-by-contact-and-type.sql'), [
      personId,
      activityType,
    ]);

    return result.rows;
  }
}
