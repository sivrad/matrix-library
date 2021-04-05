import { DEBUG } from './constants';

export const log = (body: string): void => {
    if (DEBUG) console.log(body);
};
