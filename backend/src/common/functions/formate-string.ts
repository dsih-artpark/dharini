export const formatString = (input: string) => {
  return input
    ?.split('-') // Split the string by '-'
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    ?.join(' '); // Join the words back with a space
};
