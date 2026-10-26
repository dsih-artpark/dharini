// Twilio requires E.164 numbers. Contact numbers are stored as bare local
// numbers in most of the app; this normalizes them to the +91 (India) form
// the rest of the codebase already assumes (see otp.entity.ts's 10-digit
// contactNumber column). If a number already carries the 91 country code,
// it's left as-is.
export function formatIndianPhoneNumber(contactNumber: string): string {
  const hasCountryCode =
    contactNumber.includes('91') && contactNumber.length === 12;
  return `+${hasCountryCode ? contactNumber : `91${contactNumber}`}`;
}
