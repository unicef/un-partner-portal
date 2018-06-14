import { has, uniq, any, equals } from 'ramda';

const _ = require('lodash');

export function getSuggestionValue(
  suggestion,
) {
  return suggestion;
}

export function setSuggestionValue(
  handleFormChange,
  event,
  { suggestion },
) {
  handleFormChange(suggestion);
  return suggestion;
}

export function setMultipleSuggestionValue(
  formValue,
  handleFieldChange,
  handleFormChange,
  handleMultiChange,
  event,
  { suggestion },
) {
  handleFieldChange(null, { newValue: '' });
  if (!any((equals(suggestion.value)), formValue)) {
    handleMultiChange(suggestion.label);
    handleFormChange(suggestion);
  }
  return '';
}

export function handleClear(handleFormChange, handleMultiFieldClear, indexToClear) {
  handleFormChange({ clear: true, index: indexToClear });
  handleMultiFieldClear(indexToClear);
}

export function normalizeSuggestion(suggestion, previousSuggestion) {
  if (!suggestion) return previousSuggestion;

  // fallback for injected multivalues
  // if (isNaN(previousSuggestion)) { return null; }

  if (has('clear', suggestion)) {
    return previousSuggestion.filter((_, index) => index !== suggestion.index);
  }
  if (Array.isArray(previousSuggestion)) return uniq(previousSuggestion.concat(suggestion));
  return suggestion;
}

export function getSuggestions(value, suggestionsPool) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  return inputLength === 0
    ? []
    : suggestionsPool.filter((suggestion) => {
      const keep =
        count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}


export function getAsyncSuggestions(value, asyncFunc, search) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0
    ? []
    : asyncFunc({ [search]: value, page_size: 5 }).then(response => response);
}

export const debouncedAsyncSuggestions = _.debounce(getAsyncSuggestions, 500, {
  leading: true });
