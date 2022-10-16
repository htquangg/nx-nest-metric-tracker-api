import { Between } from 'typeorm';
import { startOfDay, endOfDay, subDays, formatISO } from 'date-fns';

export const startDayNow = startOfDay(Date.now());

export const endDayNow = endOfDay(Date.now());

export const lastOneMonth = startOfDay(subDays(startDayNow, 30));

export const lastTwoMonths = startOfDay(subDays(startDayNow, 60));

export const BetweenOneDay = Between(
  startDayNow.toISOString(),
  endDayNow.toISOString(),
);

export const BetweenOneMonth = Between(
  lastOneMonth.toISOString(),
  endDayNow.toISOString(),
);

export const BetweenTwoMonths = Between(
  lastTwoMonths.toISOString(),
  endDayNow.toISOString(),
);
