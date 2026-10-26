import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SignupDto } from '../../modules/auth/dtos/signup.dto';

const errorsFor = async (payload: Record<string, unknown>) =>
  validate(plainToInstance(SignupDto, payload));

describe('AtLeastOneOf on the signup DTOs', () => {
  it('rejects a payload that supplies neither email nor phone', async () => {
    // The bug this guards: @IsOptional() short-circuits every other
    // validator when a value is absent, so {} used to validate cleanly and
    // the handler went on to look a user up by two undefined values.
    const errors = await errorsFor({});

    expect(errors.length).toBeGreaterThan(0);
    expect(JSON.stringify(errors)).toContain('At least one of email, phone');
  });

  it('accepts email alone', async () => {
    expect(await errorsFor({ email: 'someone@example.com' })).toHaveLength(0);
  });

  it('accepts phone alone', async () => {
    expect(await errorsFor({ phone: '919875645646' })).toHaveLength(0);
  });

  it('accepts both', async () => {
    const errors = await errorsFor({
      email: 'someone@example.com',
      phone: '919875645646',
    });
    expect(errors).toHaveLength(0);
  });

  it('treats an empty string as absent, not as a supplied value', async () => {
    const errors = await errorsFor({ email: '', phone: '' });

    expect(errors.length).toBeGreaterThan(0);
  });
});
