import { BaseEntity } from 'typeorm';

export type EntityProps<T> = Omit<T, keyof BaseEntity>;
