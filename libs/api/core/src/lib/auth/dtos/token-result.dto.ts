import addMilliseconds from 'date-fns/addMilliseconds';
import parse from 'date-fns/parse';
import ms from 'ms';

export abstract class Expire {
  expiry: Date;

  computeExpiry(jwtExpired: string) {
    const milli = ms(jwtExpired);
    const now = Date.now();
    this.expiry = parse(
      addMilliseconds(now, milli).toLocaleString(),
      'M/d/yyyy, h:mm:ss aaa',
      now,
    );
  }
}

export class TokenResultDto extends Expire {
  token: string;
}
