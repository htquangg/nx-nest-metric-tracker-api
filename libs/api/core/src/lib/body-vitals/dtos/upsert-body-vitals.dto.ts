import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';

import { DistanceDto, TemperatureDto } from './base-body-vitals.dto';

export class UpsertBodyVitalsParamsDto {}

export class UpsertBodyVitalsBodyDto {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => DistanceDto)
  distance: DistanceDto;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => TemperatureDto)
  temperature: TemperatureDto;
}

export interface UpsertBodyVitalsPayload
  extends UpsertBodyVitalsBodyDto,
    UpsertBodyVitalsParamsDto {}
