export const convertToYMD: (date: string | Date) => Date = (date) => {
  const newDate = new Date(date);

  const year = newDate.getFullYear();
  const month = newDate.getMonth();
  const day = newDate.getDate();

  const convDate = new Date(year, month, day);

  return convDate;
};
