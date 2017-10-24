import moment from 'moment';

export const printFormat = 'DD MMM YYYY';
const FORMAT = 'YYYY-MM-DD';

export const getToday = () => moment().format(FORMAT);

export const dayDifference = (firstDate, secondDate) =>
  moment(firstDate).diff(secondDate, 'days');

export const normalizeDate = date => moment(date).format(FORMAT).toString();

export const formatDateForPrint = (date) => {
  if (!date) return null;
  return moment(date).format(printFormat).toString();
};
