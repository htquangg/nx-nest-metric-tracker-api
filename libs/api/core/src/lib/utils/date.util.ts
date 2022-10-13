import { Between } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';

export const startDay = startOfDay(Date.now());

export const endDay = endOfDay(Date.now());

export const BetweenOneDay = Between(startDay, endDay);
