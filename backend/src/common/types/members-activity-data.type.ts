import { VisitDataForEveryMember } from './visit-data-for-every-member.type';

export interface MembersActivityData {
  visits: VisitDataForEveryMember[];
  totalNumberOfVisitsAssigned: number;
  totalNumberOfVisitsPending: number;
  totalNumberOfVisitsOverDue: number;
}
