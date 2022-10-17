import { Between } from 'typeorm';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export const startDayNow = startOfDay(Date.now());

export const endDayNow = endOfDay(Date.now());

export const startLastOneMonth = startOfDay(subDays(startDayNow, 30));

export const endLastOneMonth = endOfDay(subDays(startDayNow, 30));

export const startLastTwoMonths = startOfDay(subDays(startDayNow, 60));

export const endLastTwoMonths = endOfDay(subDays(startDayNow, 60));

export const BetweenOneDay = Between(
  startDayNow.toISOString(),
  endDayNow.toISOString(),
);

export const BetweenOneMonth = Between(
  startLastOneMonth.toISOString(),
  endDayNow.toISOString(),
);

export const BetweenTwoMonths = Between(
  startLastTwoMonths.toISOString(),
  endDayNow.toISOString(),
);
