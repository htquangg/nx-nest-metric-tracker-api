import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

import { DistanceDto } from '../dtos';
import { MeasurementUnitService } from '../../measurement-unit';
import { ExchangeRateService } from '../../exchange-rate';

import { EntityProps, EverfitBaseService } from '@everfit/api/common';
import { BodyDistance, BodyDistanceProps } from '@everfit/api/entities';
import { is, check, randomStringGenerator } from '@everfit/shared/utils';
import { DEFAULT_DISTANCE_UNIT } from '../../constants';

@Injectable()
export class DistanceService extends EverfitBaseService<BodyDistance> {
  constructor(
    @InjectRepository(BodyDistance)
    protected readonly repository: Repository<BodyDistance>,
    protected readonly measurementUnitService: MeasurementUnitService,
    protected readonly exchangeRateService: ExchangeRateService,
  ) {
    super(repository);
  }

  async findOneByBodyVitalsDetailsLogId(
    bodyVitalsDetailsLogId: string,
    transaction?: EntityManager,
  ): Promise<BodyDistance> {
    return await this.repository.findOneBy({ bodyVitalsDetailsLogId });
  }

  async upsert(
    data: Partial<BodyDistanceProps> &
      DistanceDto & { bodyVitalsDetailsLogId: string },
    transaction?: EntityManager,
  ): Promise<BodyDistance> {
    const { bodyVitalsDetailsLogId, ...restData } = data;
    const bodyDistance = await this.findOneByBodyVitalsDetailsLogId(
      bodyVitalsDetailsLogId,
    );

    if (is.nil(bodyDistance)) {
      const sourceMeasurementUnit =
        await this.measurementUnitService.getOneBySymbol(
          restData.unit as unknown as string,
        );
      const defaultMeasurementUnit =
        await this.measurementUnitService.getDefaultDistanceUnit();
      check(
        [sourceMeasurementUnit, defaultMeasurementUnit],
        is.notNil,
        new InternalServerErrorException(
          `DistanceUnit is not definded: ${sourceMeasurementUnit} -- ${defaultMeasurementUnit}`,
        ),
      );

      const exchangeRateSource = await this.exchangeRateService.getRate(
        sourceMeasurementUnit.symbol,
        defaultMeasurementUnit.symbol,
      );

      const payload: BodyDistanceProps = {
        id: randomStringGenerator(),
        bodyVitalsDetailsLogId,
        distance: data.value * exchangeRateSource,
        measurementUnitId: defaultMeasurementUnit.id,
      };

      return (await this.save(this.create(payload))) as BodyDistance;
    }

    const sourceMeasurementUnit = await this.measurementUnitService.getOneById(
      bodyDistance.measurementUnitId,
    );
    const targetMeasurementUnit =
      await this.measurementUnitService.getOneBySymbol(
        data.unit as unknown as string,
      );
    const defaultMeasurementUnit =
      await this.measurementUnitService.getDefaultDistanceUnit();
    check(
      [sourceMeasurementUnit, targetMeasurementUnit, defaultMeasurementUnit],
      is.notNil,
      new InternalServerErrorException(
        `DistanceUnit is not definded: ${sourceMeasurementUnit} -- ${targetMeasurementUnit} -- ${defaultMeasurementUnit}`,
      ),
    );

    const exchangeRateSource = await this.exchangeRateService.getRate(
      sourceMeasurementUnit.symbol,
      defaultMeasurementUnit.symbol,
    );

    const exchangeRateTarget = await this.exchangeRateService.getRate(
      targetMeasurementUnit.symbol,
      defaultMeasurementUnit.symbol,
    );

    const newBodyDistance: EntityProps<BodyDistance> = {
      ...bodyDistance,
      distance:
        bodyDistance.distance * exchangeRateSource +
        data.value * exchangeRateTarget,
      measurementUnitId: defaultMeasurementUnit.id,
    };

    return (await this.save(newBodyDistance)) as BodyDistance;
  }
}
