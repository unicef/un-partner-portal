import moment from 'moment';

export const printFormat = 'DD MMM YYYY';
const FORMAT = 'YYYY-MM-DD';
const CHART_FORMAT = 'MM/DD';

export const getToday = () => moment().format(FORMAT);

export const dayDifference = (firstDate, secondDate) => {
  const fd = moment(firstDate).format(FORMAT);
  const sd = moment(secondDate).format(FORMAT);
  return moment(fd).diff(sd, 'days');
};

export const normalizeDate = (date) => {
  if (!date) return null;
  return moment(date).format(FORMAT).toString();
};

export const formatDateForPrint = (date) => {
  if (!date || date === '-') return date;
  return moment(date).format(printFormat).toString();
};

export const formatDateForChart = (date) => {
  if (!date) return null;
  return moment(date).format(CHART_FORMAT).toString();
};

export const formatDateForDatePicker = date => moment(date).toDate();

export const isDateBefore = (first, second) => moment(first).isBefore(moment(second));
