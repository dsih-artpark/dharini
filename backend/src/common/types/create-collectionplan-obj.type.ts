import { User } from 'src/entities/user.entity';

export type CreateCollectionPlanObj = {
  collectionCollector?: User;
  collectionStartDate?: Date | string;
  collectionExpiryDate?: Date | string;
  collectionTime?: string;
};
