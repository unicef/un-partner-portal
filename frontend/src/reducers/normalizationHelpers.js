import R from 'ramda';


export const extractIds = list => R.map(item => item.id, list);

export const normId = key => item => R.assoc(key, extractIds(item[key]), item);

export const flattenToObjectKey = key => item => R.objOf(item.id, item[key]);

export const normalizeToId = item => R.objOf(item.id, item);

export const flattenToNames = item => flattenToObjectKey('name')(item);

export const flattenToId = item => R.objOf(item.id, item);

export const toObject = R.compose(R.mergeAll, R.map);

export const mergeListsFromObjectArray = (list, key) =>
  R.reduce((previous, next) => R.concat(next[key], previous), [], list);

export const equalAtPaths = path => (a, b) => R.equals(R.path(path, a), R.path(path, b));

export const selectIndexWithDefaultNull = R.propOr(null);
export const selectIndexWithDefaultEmptyObject = R.propOr({});
export const selectIndexWithDefaultEmptyArray = R.propOr([]);

export const pluckAll = R.compose(R.juxt, R.map(R.pluck));
