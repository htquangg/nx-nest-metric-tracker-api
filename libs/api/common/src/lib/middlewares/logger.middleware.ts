import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { REQUEST_ID_TOKEN_HEADER } from '../constants';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    // Getting the request log
    this.getRequestLog(req);

    // Getting the response log
    this.getResponseLog(res);

    if (next) {
      next();
    }
  }

  getRequestLog(req: Request) {
    const requestInfo = this.getRequestInfo(req);
    this.logger.log(requestInfo);
  }

  getRequestInfo(req: Request) {
    const path = req.originalUrl.split('?')[0];
    return {
      type: 'REQUEST',
      ipAddress: req.get('X-Forwarded-For') || req.ip,
      time: Date.now(),
      method: req.method,
      path,
      referer: req.get('Referer'),
      query: req.query,
      body: req.body || null,
      requestID: req.headers[REQUEST_ID_TOKEN_HEADER],
      url: `${req.protocol}://${req.get('host')}${path}`,
      userAgent: req.get('User-Agent'),
    };
  }

  getResponseLog(res: Response) {
    // https://github.com/julien-sarazin/nest-playground/issues/1#issuecomment-682588094
    const rawResponse = res.write;
    const rawResponseEnd = res.end;

    const chunkBuffers = [];

    // New chunk passed in as Buffer each time write() is called by stream
    // Take chunks as a rest parameter since it is an array. This allows applying Array methods directly (ref MDN)
    // res.write below is in object mode for write to avoid needing encoding arg (https://nodejs.org/api/stream.html#writable_writevchunks-callback)
    res.write = (...chunks) => {
      const resArgs = [];
      for (let i = 0; i < chunks.length; i++) {
        resArgs[i] = chunks[i];

        // This handling comes in when buffer is full, hence rawResponse === false after rawResponse.apply() below
        // Ref: Example under https://nodejs.org/api/stream.html#class-streamwritable
        // Callback (res.write) resumes write stream
        if (!resArgs[i]) {
          res.once('drain', res.write);

          // Resume from last falsy iteration
          --i;
        }
      }

      // Copy buffer to new buffer instance then push into chunks[]
      // resArgs[0] contains the response body
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }

      // res.write shuold return true if the internal buffer is less than the default highWaterMark. If false is returned, further attempts to write data to the stream should stop until the 'drain' event is emitted.
      // The apply() method accepts two arguments (Ref: https://www.javascripttutorial.net/javascript-apply-method/):
      // thisArg (res) is the value of 'this' provided for function rawResponse
      // The args argument (restArgs) is an array that specifies the arguments of the function rawResponse
      return rawResponse.apply(res, resArgs);
    };

    res.end = (...chunk) => {
      const resArgs = [];
      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i];
      }

      // Copy buffer to new buffer instance then push into chunks[]
      // resArgs[0] contains the response body
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }

      // Encode buffer as utf8 JSON string
      const body = Buffer.concat(chunkBuffers).toString('utf8');

      const responseLog = {
        type: 'RESPONSE',
        statusCode: res.statusCode,
        time: Date.now(),
        body: typeof body === 'object' ? JSON.parse(body) : body || {},
        // Returns a shallow copy of the current outgoing headers
        headers: res.getHeaders(),
      };

      this.logger.log(responseLog);

      // res.end() is satisfied after passing in restArgs as params
      // Doing so creates 'end' event to indicate that the entire body has been received.
      // Otherwise, the stream will continue forever (ref: https://nodejs.org/api/stream.html#event-end_1)
      rawResponseEnd.apply(res, resArgs);
      return responseLog as unknown as Response;
    };
  }
}
