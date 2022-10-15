import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { DistanceUnit, TemperatureUnit } from '../../constants';
import { DistanceUnitType, TemperatureUnitType } from '../../types';

export class DistanceDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsEnum(DistanceUnit)
  unit: DistanceUnitType;
}

export class TemperatureDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsEnum(TemperatureUnit)
  unit: TemperatureUnitType;
}
