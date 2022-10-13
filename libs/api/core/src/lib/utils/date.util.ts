import { Between } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';

export const startDayNow = startOfDay(Date.now());

export const endDayNow = endOfDay(Date.now());

export const BetweenOneDay = Between(startDayNow, endDayNow);
