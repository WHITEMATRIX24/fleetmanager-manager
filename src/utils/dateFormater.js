export const formatDate = (rawDate) => {
  const newDate = new Date(rawDate);
  return newDate.toDateString();
};
