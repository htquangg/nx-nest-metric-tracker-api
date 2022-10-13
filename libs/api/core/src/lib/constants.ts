export const DistanceUnit = {
  M: 'M',
  CM: 'CM',
  INCH: 'INCH',
  FEET: 'FEET',
  YARD: 'YARD',
} as const;

export const DEFAULT_DISTANCE_VALUE = -Infinity;

export const DEFAULT_DISTANCE_UNIT = DistanceUnit.M;

export const TemperatureUnit = {
  C: 'C',
  F: 'F',
  K: 'K',
} as const;

export const DEFAULT_TEMPERATURE_VALUE = -Infinity;

export const DEFAULT_TEMPERATURE_UNIT = TemperatureUnit.C;
