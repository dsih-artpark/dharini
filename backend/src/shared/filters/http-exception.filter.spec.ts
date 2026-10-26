import { ArgumentsHost, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './http-exception.filter';

describe('AllExceptionsFilter', () => {
  const buildHost = (request: any): ArgumentsHost => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    return {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as unknown as ArgumentsHost;
  };

  it('logs a redacted summary of the request body, never the raw PII', () => {
    const errorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    const filter = new AllExceptionsFilter();
    const host = buildHost({
      method: 'POST',
      url: '/auth/login',
      body: { email: 'a@example.com', password: 'hunter2' },
      params: {},
      query: {},
    });

    filter.catch(new Error('boom'), host);

    expect(errorSpy).toHaveBeenCalled();
    const loggedPayload = errorSpy.mock.calls[0][1] as string;
    expect(loggedPayload).not.toContain('a@example.com');
    expect(loggedPayload).not.toContain('hunter2');
    expect(loggedPayload).toContain('[REDACTED]');

    errorSpy.mockRestore();
  });
});
