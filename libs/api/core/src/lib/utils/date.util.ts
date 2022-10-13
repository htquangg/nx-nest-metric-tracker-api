import { Between } from 'typeorm';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export const startDayNow = startOfDay(Date.now());

export const endDayNow = endOfDay(Date.now());

export const lastOneMonth = startOfDay(subDays(startDayNow, 30));

export const lastTwoMonths = startOfDay(subDays(startDayNow, 60));

export const BetweenOneDay = Between(startDayNow, endDayNow);

export const BetweenOneMonth = Between(startDayNow, lastOneMonth);

export const BetweenTwoMonths = Between(startDayNow, lastTwoMonths);
