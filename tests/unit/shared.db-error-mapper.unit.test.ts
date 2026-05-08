import { AppError } from '../../src/shared/errors/app-error';
import { throwMappedDbError } from '../../src/shared/errors/db-error-mapper';

describe('db-error-mapper unit', () => {
  it('mapea un codigo conocido a AppError', () => {
    expect(() =>
      throwMappedDbError(
        { code: '23505' },
        {
          '23505': { message: 'Duplicado', statusCode: 409 },
        },
      ),
    ).toThrow('Duplicado');
  });

  it('re-lanza AppError sin cambios', () => {
    const appError = new AppError('Controlado', 418);

    expect(() => throwMappedDbError(appError, {})).toThrow(appError);
  });

  it('usa fallback cuando el codigo no esta mapeado', () => {
    expect(() => throwMappedDbError({ code: '99999' }, {}, 'Fallback')).toThrow('Fallback');
  });
});
