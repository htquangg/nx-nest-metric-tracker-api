import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';

import { DistanceUnit, TemperatureUnit } from '../../constants';
import { DistanceUnitType, TemperatureUnitType } from '../../types';

export class Distance {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsEnum(DistanceUnit)
  unit: DistanceUnitType;
}

export class Temperature {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsEnum(TemperatureUnit)
  unit: TemperatureUnitType;
}

export class UpsertBodyVitalsDto {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Distance)
  distance: Distance;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Temperature)
  temperature: Temperature;
}
