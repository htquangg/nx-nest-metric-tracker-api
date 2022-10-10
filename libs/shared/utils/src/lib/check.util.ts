// https://github.com/redux-saga/redux-saga/blob/main/packages/core/src/internal/utils.js#LC26
/* eslint-disable  @typescript-eslint/no-explicit-any */
/**
 * Check type of value.
 *
 * @param {any} value
 * @param {Function} predicate
 * @param {string} error
 *
 * @example
 * `check(cb, is.func, "callback must be a function")`
 */
export const check = (
  value: any,
  predicate: (...args: any[]) => any,
  error: string,
) => {
  if (!predicate(value)) {
    throw new Error(error);
  }
};
