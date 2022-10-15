import { IsEnum, IsOptional } from 'class-validator';
import { DistanceUnit, TemperatureUnit } from '../../constants';
import { DistanceUnitType, TemperatureUnitType } from '../../types';

export class GetBodyVitalsDto {
  @IsOptional()
  @IsEnum(DistanceUnit)
  distanceUnit?: DistanceUnitType;

  @IsOptional()
  @IsEnum(TemperatureUnit)
  temperatureUnit?: TemperatureUnitType;
}
