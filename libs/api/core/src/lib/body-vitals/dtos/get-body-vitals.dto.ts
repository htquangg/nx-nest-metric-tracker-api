import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { DistanceUnit, TemperatureUnit } from '../../constants';
import { DistanceUnitType, TemperatureUnitType } from '../../types';

export class GetBodyVitalsParamsDto {
  @IsOptional()
  @IsString()
  bodyVitalsId?: string;

  @IsOptional()
  @IsString()
  bodyVitalsDetailsId?: string;
}

export class GetBodyVitalsQueryDto {
  @IsOptional()
  @IsEnum(DistanceUnit)
  distanceUnit?: DistanceUnitType;

  @IsOptional()
  @IsEnum(TemperatureUnit)
  temperatureUnit?: TemperatureUnitType;

  @IsOptional()
  @IsBoolean()
  lastTwoMonths: boolean;

  @IsOptional()
  @IsBoolean()
  lastOneMonth: boolean;
}

export interface GetBodyVitalsPayload
  extends GetBodyVitalsParamsDto,
    GetBodyVitalsQueryDto {}
