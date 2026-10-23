export function generateRandomCode(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

export function formatDate(date: string | Date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime()) || d.getTime() === 0) return "—";

  const formattedDate = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
}

// get the Weekday from timestamp
export function formatWeekDay(date: string | Date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short", // Tue
  });
  return formattedDate;
}

export function formatTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatTime12Hour(timeString: string) {
  const [hour, minute] = timeString.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
  return `${formattedHour}:${minute} ${ampm}`;
}

export function debounce<T extends (...args: never[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export function getFileNameFromS3Url(url: string): string {
  if (!url) return "";
  try {
    const pathname = new URL(url).pathname;
    return pathname.substring(pathname.lastIndexOf("/") + 1);
  } catch (error) {
    console.log(`Invalid URL: ${url}`, error);
    return "";
  }
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string) {
  // Accepts 10-digit Indian mobile numbers (with optional +91 or 91 prefix for input flexibility)
  // API expects 10 digits only, formatPhoneForAPI handles stripping the prefix
  const phoneRegex = /^(\+?91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

export function formatPhoneForAPI(phone: string): string {
  // Remove spaces, + sign, and 91 prefix - API expects 10-digit number only
  const cleaned = phone.replace(/\s/g, "").replace(/^\+/, "");

  // Strip 91 prefix if present
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned.slice(2);
  }
  return cleaned;
}
