import { ContactRepository } from '../../../src/modules/contacts/contact.repository';
import { ContactService } from '../../../src/modules/contacts/contact.service';
import { AppError } from '../../../src/shared/errors/app-error';

describe('ContactService unit', () => {
  const service = new ContactService();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('create devuelve contacto cuando repository.create funciona', async () => {
    jest.spyOn(ContactRepository.prototype, 'create').mockResolvedValue({
      id: 1,
      firstName: 'Ana',
      lastName: 'Garcia',
      dateOfBirth: '1992-04-20',
      email: 'ana@example.com',
      phones: [],
      addresses: [],
    });

    const response = await service.create({
      firstName: 'Ana',
      lastName: 'Garcia',
      dateOfBirth: '1992-04-20',
      email: 'ana@example.com',
      phones: [],
      addresses: [],
    });

    expect(response.id).toBe(1);
  });

  it('create mapea unique violation a 409', async () => {
    jest.spyOn(ContactRepository.prototype, 'create').mockRejectedValue({ code: '23505' });

    await expect(
      service.create({
        firstName: 'Ana',
        lastName: 'Garcia',
        dateOfBirth: '1992-04-20',
        email: 'ana@example.com',
        phones: [],
        addresses: [],
      }),
    ).rejects.toMatchObject({ statusCode: 409, message: 'El email ya existe.' });
  });

  it('findByEmail retorna 404 cuando no existe', async () => {
    jest.spyOn(ContactRepository.prototype, 'findByEmail').mockResolvedValue(null);

    await expect(service.findByEmail('no@existe.com')).rejects.toMatchObject({
      statusCode: 404,
      message: 'Contacto no encontrado.',
    });
  });

  it('update retorna 404 cuando no existe', async () => {
    jest.spyOn(ContactRepository.prototype, 'update').mockResolvedValue(null);

    await expect(service.update(999, { firstName: 'X' })).rejects.toMatchObject({
      statusCode: 404,
      message: 'Contacto no encontrado.',
    });
  });

  it('delete retorna 404 cuando no existe', async () => {
    jest.spyOn(ContactRepository.prototype, 'delete').mockResolvedValue(false);

    await expect(service.delete(999)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Contacto no encontrado.',
    });
  });

  it('create re-lanza AppError sin modificar', async () => {
    const appError = new AppError('Error controlado', 418);
    jest.spyOn(ContactRepository.prototype, 'create').mockRejectedValue(appError);

    await expect(
      service.create({
        firstName: 'Ana',
        lastName: 'Garcia',
        dateOfBirth: '1992-04-20',
        email: 'ana@example.com',
        phones: [],
        addresses: [],
      }),
    ).rejects.toBe(appError);
  });
});
