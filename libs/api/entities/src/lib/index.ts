import { User } from './user.entity';
import { BodyVitalsLog } from './body-vitals-log.entity';
import { BodyDistance } from './body-distance.entity';
import { BodyTemperature } from './body-temperature.entity';
import { MeasurementUnit } from './measurement-unit.entity';
import { ExchangeRate } from './exchange-rate.entity';

export * from './user.entity';
export * from './body-vitals-log.entity';
export * from './body-distance.entity';
export * from './body-temperature.entity';
export * from './measurement-unit.entity';
export * from './exchange-rate.entity';

export const Entities = [
  User,
  BodyVitalsLog,
  BodyDistance,
  BodyTemperature,
  MeasurementUnit,
  ExchangeRate,
];
