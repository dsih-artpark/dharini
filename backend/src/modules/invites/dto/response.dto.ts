import { Invite } from 'src/entities/invite.entity';

export class FetchAllInviteResponse {
  success: boolean;
  message: string;
  data: Invite[];
}
export class InviteResponse {
  success: boolean;
  message: string;
  data: Invite;
}
