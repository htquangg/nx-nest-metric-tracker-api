import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

export const THROTTLER_MESSAGE = 'Rate limit exceeded. Please try again later.';

@Injectable()
export class EverfitThrottlerGuard extends ThrottlerGuard {
  protected errorMessage = THROTTLER_MESSAGE;
}
