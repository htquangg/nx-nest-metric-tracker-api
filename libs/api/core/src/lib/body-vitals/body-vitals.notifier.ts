import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { startOfDay } from 'date-fns';

import { BodyVitalsService } from './body-vitals.service';
import { BodyVitalsEvents } from './constants';

import { is } from '@everfit/shared/utils';

@Injectable()
export class BodyVitalsNotifier {
  constructor(protected readonly bodyVitalsService: BodyVitalsService) {}

  @OnEvent(BodyVitalsEvents.NewBodyVitalsDetails)
  async onNewBodyVitalsDetails(data: {
    bodyVitalsLogId: string;
    jsonData: string;
  }) {
    const bodyVitalsLog = await this.bodyVitalsService.findOneById(
      data.bodyVitalsLogId,
    );
    if (is.nil(bodyVitalsLog)) return;

    const createdAt = startOfDay(bodyVitalsLog.createdAt).getTime();

    let jsonData;

    if (is.notNil(bodyVitalsLog.jsonData)) {
      jsonData = JSON.parse(bodyVitalsLog.jsonData);
      jsonData[`${createdAt}`].push(data.jsonData);
    } else {
      jsonData = { [`${createdAt}`]: [data.jsonData] };
    }
    return this.bodyVitalsService.save({
      ...bodyVitalsLog,
      jsonData: JSON.stringify(jsonData),
    });
  }
}
