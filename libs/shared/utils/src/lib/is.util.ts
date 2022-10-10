// https://github.com/redux-saga/redux-saga/blob/main/packages/is/src/index.js
// https://github.com/nestjs/nest/blob/master/packages/common/utils/shared.utils.ts
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const nil = (value: any): value is null | undefined =>
  value === null || value === undefined;
export const notNil = (value: any): boolean =>
  value !== null && value !== undefined;
export const func = (value: any): boolean => typeof value === 'function';
export const number = (value: any): value is number =>
  typeof value === 'number';
export const string = (value: any): value is string =>
  typeof value === 'string';
export const array = Array.isArray;
export const object = (value: any): value is object =>
  value && !array(value) && typeof value === 'object';
export const plainObject = (value: any): value is object => {
  if (!object(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const ctor =
    Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
    proto.constructor;
  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) ===
      Function.prototype.toString.call(Object)
  );
};
export const promise = (value: Promise<any>) => value && func(value.then);
export const iterator = (value: Iterator<any>) =>
  value && func(value.next) && func(value.throw);
export const iterable = (value: Iterable<any>) =>
  value && func(Symbol) ? func(value[Symbol.iterator]) : array(value);
export const constructor = (value: any): boolean => value === 'constructor';
export const symbol = (value: any): value is symbol =>
  typeof value === 'symbol';

// https://github.com/ianstormtaylor/is-empty/blob/master/lib/index.js
export const empty = (val: any) => {
  const has = Object.prototype.hasOwnProperty;
  const toString = Object.prototype.toString;

  // Null and Undefined...
  if (val == null) return true;

  // Booleans...
  if ('boolean' == typeof val) return false;

  // Numbers...
  if ('number' == typeof val) return val === 0;

  // Strings...
  if ('string' == typeof val) return val.length === 0;

  // Functions...
  if ('function' == typeof val) return val.length === 0;

  // Arrays...
  if (Array.isArray(val)) return val.length === 0;

  // Errors...
  if (val instanceof Error) return val.message === '';

  // Objects...
  if (val.toString == toString) {
    switch (val.toString()) {
      // Maps, Sets, Files and Errors...
      case '[object File]':
      case '[object Map]':
      case '[object Set]': {
        return val.size === 0;
      }

      // Plain objects...
      case '[object Object]': {
        for (const key in val) {
          if (has.call(val, key)) return false;
        }

        return true;
      }
    }
  }

  // Anything else...
  return false;
};
