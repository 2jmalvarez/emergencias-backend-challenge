import { ActivityRepository } from '../../../src/modules/activities/activity.repository';
import { ActivityService } from '../../../src/modules/activities/activity.service';

describe('ActivityService unit', () => {
  const service = new ActivityService();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('create devuelve actividad cuando repository.create funciona', async () => {
    jest.spyOn(ActivityRepository.prototype, 'create').mockResolvedValue({
      id: 1,
      personId: 1,
      activityType: 'call',
      activityDate: '2026-05-08T14:30:00.000Z',
      description: null,
    });

    const response = await service.create({
      personId: 1,
      activityType: 'call',
      activityDate: '2026-05-08T14:30:00.000Z',
    });

    expect(response.id).toBe(1);
  });

  it('create mapea foreign key violation a 404', async () => {
    jest.spyOn(ActivityRepository.prototype, 'create').mockRejectedValue({ code: '23503' });

    await expect(
      service.create({
        personId: 999,
        activityType: 'call',
        activityDate: '2026-05-08T14:30:00.000Z',
      }),
    ).rejects.toMatchObject({ statusCode: 404, message: 'Contacto no encontrado.' });
  });

  it('create mapea check violation a 400', async () => {
    jest.spyOn(ActivityRepository.prototype, 'create').mockRejectedValue({ code: '23514' });

    await expect(
      service.create({
        personId: 1,
        activityType: 'call',
        activityDate: '2026-05-08T14:30:00.000Z',
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'Los datos enviados no cumplen las reglas de la base.',
    });
  });
});
