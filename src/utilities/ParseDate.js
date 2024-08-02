export const parseDateString = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

export const parseDateStringWithTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isSameYear = date.getFullYear() === now.getFullYear();

  const dateOptions = { month: "short", day: "numeric" };
  if (!isSameYear) {
    dateOptions.year = "2-digit";
  }
  const datePart = date.toLocaleDateString("en-US", dateOptions);

  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  const timePart = date.toLocaleTimeString("en-US", timeOptions);

  if (isToday) {
    return timePart;
  }

  return `${datePart} - ${timePart}`;
};