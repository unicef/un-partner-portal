import moment from 'moment';

export const printFormat = 'DD MMM YYYY';
const FORMAT = 'YYYY-MM-DD';

export const getToday = () => moment().format(FORMAT);

export const dayDifference = (firstDate, secondDate) =>
  moment.duration(firstDate, secondDate).days();

export const normalizeDate = date => moment(date).format(FORMAT).toString();

export const formatDateForPrint = date => moment(date).format(printFormat).toString();
