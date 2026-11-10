export type CreateCollectionPlanObj = {
  // The site's collectors, primary first.
  collectorIds?: string[];
  collectionStartDate?: Date | string;
  collectionExpiryDate?: Date | string;
  collectionTime?: string;
};
