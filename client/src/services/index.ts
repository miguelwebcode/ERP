export const formatDate = (date: Date) => {
  const padTo2Digits = (num: number) => num.toString().padStart(2, "0");

  return (
    `${padTo2Digits(date.getDate())}/` +
    `${padTo2Digits(date.getMonth() + 1)}/` +
    `${date.getFullYear()} ` +
    `${padTo2Digits(date.getHours())}:` +
    `${padTo2Digits(date.getMinutes())}`
  );
};
