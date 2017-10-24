import R from 'ramda';

const verifications = {
  is_cert_uploaded: true,
  is_mm_consistent: true,
  is_indicate_results: true,
  is_rep_risk: false,
  is_yellow_flag: false,
};

const checkSingleQuestion = (answer, question) => {
  if (answer === verifications[question]) return 1;
  else if (answer === null) return null;
  return 0;
};

const reduceAnswersList = (acc, [_, nextValue]) => {
  if (nextValue === null || acc === null) return null;
  return acc + nextValue;
};

export const getGoodVerifCount =
  R.compose(
    R.reduce(reduceAnswersList, 0),
    R.toPairs,
    R.mapObjIndexed(checkSingleQuestion),
  );

export const countGoodAnswers = (verification) => {
  const answers = R.pick([
    'is_cert_uploaded',
    'is_mm_consistent',
    'is_indicate_results',
    'is_rep_risk',
    'is_yellow_flag',
  ], verification);
  return getGoodVerifCount(answers);
};

export const isPartnerVerified = (verification) => {
  const goodVerifCount = getGoodVerifCount(verification);
  if (goodVerifCount === null) return null;
  else if (goodVerifCount === 5) return true;
  return false;
};
