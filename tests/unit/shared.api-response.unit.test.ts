import type { Response } from 'express';

import { sendError, sendNoContent, sendSuccess } from '../../src/shared/http/api-response';

const createResponseMock = () => {
  const json = jest.fn();
  const send = jest.fn();
  const status = jest.fn(() => ({ json, send }));

  return {
    res: { status } as unknown as Response,
    status,
    json,
    send,
  };
};

describe('api-response unit', () => {
  it('sendSuccess responde con data y error null', () => {
    const { res, status, json } = createResponseMock();

    sendSuccess(res, 200, { id: 1 });

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ data: { id: 1 }, error: null });
  });

  it('sendError responde con data null y error', () => {
    const { res, status, json } = createResponseMock();

    sendError(res, 400, 'Error de prueba', { code: 'TEST' });

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      data: null,
      error: { message: 'Error de prueba', code: 'TEST', details: undefined },
    });
  });

  it('sendNoContent responde 204', () => {
    const { res, status, send } = createResponseMock();

    sendNoContent(res);

    expect(status).toHaveBeenCalledWith(204);
    expect(send).toHaveBeenCalled();
  });
});
