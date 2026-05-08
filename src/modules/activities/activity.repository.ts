import type { ActivityWithContact, CreateActivityDto } from './activity.types';
import { pool } from '../../config/db';

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
      `INSERT INTO contact_activities (person_id, activity_type, activity_date, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, person_id AS "personId", activity_type AS "activityType", activity_date AS "activityDate", description`,
      [input.personId, input.activityType, input.activityDate, input.description ?? null],
    );

    return result.rows[0];
  }

  public async searchByContactAndType(
    personId: number,
    activityType: 'call' | 'meeting' | 'email',
  ): Promise<ActivityWithContact[]> {
    const result = await pool.query<ActivityWithContact>(
      `SELECT
         ca.id,
         ca.person_id AS "personId",
         ca.activity_type AS "activityType",
         ca.activity_date AS "activityDate",
         ca.description,
         JSON_BUILD_OBJECT(
           'firstName', p.first_name,
           'lastName', p.last_name,
           'email', p.email,
           'dateOfBirth', p.date_of_birth
         ) AS contact
       FROM contact_activities ca
       JOIN person p ON p.id = ca.person_id
       WHERE ca.person_id = $1 AND ca.activity_type = $2
       ORDER BY ca.activity_date DESC`,
      [personId, activityType],
    );

    return result.rows;
  }
}
