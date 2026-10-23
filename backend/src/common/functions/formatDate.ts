export const formatEndDate = (date: string): string => {
  // If endDate already contains a time, return it as is
  return date?.includes(' ') || date?.includes('T') ? date : `${date} 23:59:59`;
};
