import respond from './respond';
import {Response} from 'express';

export const SUCCESS = (res: Response, message: string | undefined = undefined, data: object = {}) => respond(res, message ?? "Success", 200, data);

export const NOT_FOUND = (res: Response, message: string | undefined = undefined, data: object = {}) => respond(res, message ?? "Not found", 404, data);
