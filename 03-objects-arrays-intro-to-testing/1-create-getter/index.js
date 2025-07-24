/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const keys = path.split('.');

  return function(obj) {
    return keys.reduce((result, key) => {
      if (result && Object.hasOwn(result, key)) {
        return result[key];
      }
    }, obj);
  };
}
