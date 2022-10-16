import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { TemperatureDto } from '../dtos';
import { MeasurementUnitService } from '../../measurement-unit';
import { ExchangeRateService } from '../../exchange-rate';

import { EntityProps, EverfitBaseService } from '@everfit/api/common';
import { BodyTemperature, BodyTemperatureProps } from '@everfit/api/entities';
import { is, check, randomStringGenerator } from '@everfit/shared/utils';
import { DEFAULT_TEMPERATURE_UNIT } from '../../constants';

@Injectable()
export class TemperatureService extends EverfitBaseService<BodyTemperature> {
  constructor(
    @InjectRepository(BodyTemperature)
    protected readonly repository: Repository<BodyTemperature>,
    protected readonly measurementUnitService: MeasurementUnitService,
    protected readonly exchangeRateService: ExchangeRateService,
  ) {
    super(repository);
  }

  async findOneByBodyVitalsDetailsLogId(
    bodyVitalsDetailsLogId: string,
    transaction?: EntityManager,
  ): Promise<BodyTemperature> {
    return await this.repository.findOneBy({ bodyVitalsDetailsLogId });
  }

  async upsert(
    data: Partial<BodyTemperatureProps> &
      TemperatureDto & { bodyVitalsDetailsLogId: string },
    transaction?: EntityManager,
  ): Promise<BodyTemperature> {
    const { bodyVitalsDetailsLogId, ...restData } = data;
    const bodyTemperature = await this.findOneByBodyVitalsDetailsLogId(
      bodyVitalsDetailsLogId,
    );

    if (is.nil(bodyTemperature)) {
      const sourceMeasurementUnit =
        await this.measurementUnitService.getOneBySymbol(
          restData.unit as unknown as string,
        );
      const defaultMeasurementUnit =
        await this.measurementUnitService.getDefaultTemperatureUnit();
      check(
        [sourceMeasurementUnit, defaultMeasurementUnit],
        is.notNil,
        new InternalServerErrorException(
          `TemperatureUnit is not definded: ${sourceMeasurementUnit} -- ${defaultMeasurementUnit}`,
        ),
      );

      const exchangeRateSource = await this.exchangeRateService.getRate(
        sourceMeasurementUnit.symbol,
        defaultMeasurementUnit.symbol,
      );

      const payload: BodyTemperatureProps = {
        id: randomStringGenerator(),
        bodyVitalsDetailsLogId,
        temperature: data.value * exchangeRateSource,
        measurementUnitId: defaultMeasurementUnit.id,
      };

      return (await this.save(this.create(payload))) as BodyTemperature;
    }

    const sourceMeasurementUnit = await this.measurementUnitService.getOneById(
      bodyTemperature.measurementUnitId,
    );
    const targetMeasurementUnit =
      await this.measurementUnitService.getOneBySymbol(
        data.unit as unknown as string,
      );
    const defaultMeasurementUnit =
      await this.measurementUnitService.getDefaultTemperatureUnit();
    check(
      [sourceMeasurementUnit, targetMeasurementUnit, defaultMeasurementUnit],
      is.notNil,
      new InternalServerErrorException(
        `TemperatureUnit is not definded: ${sourceMeasurementUnit} -- ${targetMeasurementUnit} -- ${defaultMeasurementUnit}`,
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

    const newBodyTemperature: EntityProps<BodyTemperature> = {
      ...bodyTemperature,
      temperature:
        bodyTemperature.temperature * exchangeRateSource +
        data.value * exchangeRateTarget,
      measurementUnitId: defaultMeasurementUnit.id,
    };

    return (await this.save(newBodyTemperature)) as BodyTemperature;
  }
}
