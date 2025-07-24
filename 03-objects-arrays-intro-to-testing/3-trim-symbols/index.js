/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }

  if (size === 0) {
    return '';
  }

  let result = '';
  let count = 0;
  let prevChar = '';

  for (let i = 0; i < string.length; i++) {
    const char = string[i];

    if (char === prevChar) {
      if (count < size) {
        result += char;
        count++;
      }
    } else {
      result += char;
      count = 1;
      prevChar = char;
    }
  }

  return result;
}
