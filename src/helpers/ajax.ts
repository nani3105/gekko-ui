import * as superagent from 'superagent';
import * as noCache from 'superagent-no-cache';
import { restPath } from './api';

export function processResponse(next: (err: any, response: any | undefined) => void) {
  return (err: any, res: any) => {
    if (err) {
      next(err, undefined);
    }
    if (!res.text) {
      return next('no data', undefined);
    }

    const data = JSON.parse(res.text);
    next(false, data);
  };
}

export function post(to: string, data: any, next: (err: any, response: any) => void) {
  superagent
    .post(restPath + to)
    .use(noCache)
    .send(data)
    .end(processResponse(next));
}

export function get(to: string, next: (err: any, response: any) => void) {
  superagent
    .get(restPath + to)
    .use(noCache)
    .end(processResponse(next));
}
