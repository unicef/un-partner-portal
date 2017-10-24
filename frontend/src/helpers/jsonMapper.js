/* eslint-disable react/prop-types */
import R from 'ramda';

export const mapInnerFields = (key, json, structure) => R.mapObjIndexed((value, mapKey) => {
  if (R.has(mapKey, json)) {
    return json[mapKey];
  } else if (R.has(`${key}.${mapKey}`, json)) {
    return json[`${key}.${mapKey}`];
  }
  return null;
}, structure);

export const mapJsonSteps = (key, structure, json) => R.mapObjIndexed((value, keyStruct) => {
  if (value) {
    return mapInnerFields(key, json, value);
  }

  if (R.has(keyStruct, json)) {
    return json[keyStruct];
  } else if (R.has(`${key}.${keyStruct}`, json)) {
    return json[`${key}.${keyStruct}`];
  }
  return null;
}, structure);


export const flatten = (data) => {
  const result = {};

  function recurse(cur, prop) {
    if (prop === 'gov_doc') { }

    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur) || prop === 'gov_doc' || prop === 'registration_doc') {
      result[prop] = cur;
    } else {
      let isEmpty = true;
      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? `${p}` : p);
      }
      if (isEmpty && prop) { result[prop] = {}; }
    }
  }
  recurse(data, '');
  return result;
};
