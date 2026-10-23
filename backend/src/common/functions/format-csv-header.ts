export const beautifyHeader = (header: string): string => {
  return header
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim(); // Remove any starting space
};
