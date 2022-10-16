import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

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

    let jsonData;

    if (is.notNil(bodyVitalsLog.jsonData)) {
      jsonData = JSON.parse(bodyVitalsLog.jsonData);
      jsonData.push(data.jsonData);
    } else {
      jsonData = [data.jsonData];
    }
    return this.bodyVitalsService.save({
      ...bodyVitalsLog,
      jsonData: JSON.stringify(jsonData),
    });
  }
}
