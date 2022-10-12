export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';

export const ERROR_MESSAGES = {
  EMAIL_EXIST: 'This email address is already in use.',
  EMAIL_INVALID: 'This email address is invalid.',
  EMAIL_NOT_FOUND: 'There is no account associated with this address.',
  EMAIL_NOT_VERIFIED: 'Email address is not verified',
  USER_NOT_FOUND: 'User is not found.',
  PASSWORD_INCORRECT: 'Incorrect password.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
};

// export enum USER_ROLES {
//   PUBLIC = 'b8013297-ad85-404c-a89e-dd7c715d461e',
//   APP = 'cc5c0592-67ed-4237-a0d3-1551e547125b',
// }
export const USER_ROLES = {
  PUBLIC: 'b8013297-ad85-404c-a89e-dd7c715d461e',
  APP: 'cc5c0592-67ed-4237-a0d3-1551e547125b',
} as const;
