import * as is from './is.util';

// https://github.com/redux-saga/redux-saga/blob/main/packages/core/src/internal/utils.js#LC26
/* eslint-disable  @typescript-eslint/no-explicit-any */
/**
 * Check type of value.
 *
 * @param {any} values
 * @param {Function} predicate
 * @param {string} error
 *
 * @example
 * `check(cb, is.func, "callback must be a function")`
 */
export const check = (
  values: any | any[],
  predicate: (...args: any[]) => any,
  error: string | Error,
) => {
  if (!is.array(values)) {
    values = [values];
  }
  values.map((value) => {
    if (!predicate(value)) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error);
    }
  });
};
