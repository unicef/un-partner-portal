import R from 'ramda';


const extractIds = list => R.map(item => item.id, list);

export const normId = key => item => R.assoc(key, extractIds(item[key]), item);

export const flattenToObjectKey = key => item => R.objOf(item.id, item[key]);

export const flattenToNames = item => flattenToObjectKey('name')(item);

export const toObject = R.compose(R.mergeAll, R.map);

export const mergeListsFromObjectArray = (list, key) =>
  R.reduce((previous, next) => R.concat(next[key], previous), [], list);
