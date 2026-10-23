import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

/**
 * Query for `GET /users/lookup`.
 *
 * Exactly one of `email` / `contactNumber` is supplied. Both are matched
 * *exactly* (email case-insensitively) — there is deliberately no partial,
 * prefix or wildcard matching, so the route can only confirm an identifier
 * the caller already typed in full. It cannot be used to browse the
 * directory.
 */
export class LookupUserDto {
  @ApiPropertyOptional({ description: 'Exact email', example: 'user@mail.com' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail({}, { message: 'Enter a valid email address.' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Exact 10-digit phone',
    example: '9876543210',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Enter a valid 10-digit phone number.' })
  contactNumber?: string;
}

/**
 * Deliberately minimal. Pre-populating the "add user" forms needs a display
 * name and the id to attach a role to — nothing else. Notably absent: the
 * user's roles, teams, projects and workspaces, so this route never discloses
 * which tenants a user belongs to.
 */
export class LookupUserMatch {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  firstName?: string | null;

  @ApiPropertyOptional()
  lastName?: string | null;

  @ApiPropertyOptional()
  email?: string | null;

  @ApiPropertyOptional()
  contactNumber?: string | null;
}

export class LookupUserResult {
  @ApiProperty({ description: 'Whether an active user holds this identifier' })
  exists: boolean;

  @ApiPropertyOptional({ type: LookupUserMatch })
  user?: LookupUserMatch;
}

export class LookupUserResponse {
  success: boolean;
  message: string;
  data: LookupUserResult;
}
