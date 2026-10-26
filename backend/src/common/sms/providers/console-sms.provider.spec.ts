import { ConsoleSmsProvider } from './console-sms.provider';

describe('ConsoleSmsProvider', () => {
  it('logs a masked phone number and never the message body', async () => {
    const provider = new ConsoleSmsProvider();
    const logSpy = jest
      .spyOn((provider as any).logger, 'log')
      .mockImplementation(() => undefined);

    await provider.sendSms('+918334023456', 'your otp is 123456');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const loggedLine = logSpy.mock.calls[0][0] as string;
    expect(loggedLine).not.toContain('123456');
    expect(loggedLine).not.toContain('+918334023456');
    expect(loggedLine).toContain('+918');
    expect(loggedLine).toContain('56');
  });
});
