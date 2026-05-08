import type { ActivityWithContact, CreateActivityDto } from './activity.types';

import { ActivityRepository } from './activity.repository';

import { PG_ERROR_CODES } from '../../shared/errors/db-error-codes';
import { throwMappedDbError } from '../../shared/errors/db-error-mapper';

export class ActivityService {
  private readonly repository = new ActivityRepository();

  public async create(input: CreateActivityDto) {
    try {
      return await this.repository.create(input);
    } catch (error: unknown) {
      return throwMappedDbError(error, {
        [PG_ERROR_CODES.FOREIGN_KEY_VIOLATION]: {
          message: 'Contacto no encontrado.',
          statusCode: 404,
        },
        [PG_ERROR_CODES.CHECK_VIOLATION]: {
          message: 'Los datos enviados no cumplen las reglas de la base.',
          statusCode: 400,
        },
        [PG_ERROR_CODES.INVALID_TEXT_REPRESENTATION]: {
          message: 'Los datos enviados no cumplen las reglas de la base.',
          statusCode: 400,
        },
      });
    }
  }

  public async search(
    personId: number,
    activityType: 'call' | 'meeting' | 'email',
  ): Promise<ActivityWithContact[]> {
    return this.repository.searchByContactAndType(personId, activityType);
  }
}
