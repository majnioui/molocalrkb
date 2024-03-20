import dayjs from 'dayjs/esm';

import { IEvents, NewEvents } from './events.model';

export const sampleWithRequiredData: IEvents = {
  id: 16489,
};

export const sampleWithPartialData: IEvents = {
  id: 2029,
  type: 'zowie',
  state: 'geez',
  severity: 'worth',
  entityName: 'rudely needily',
  entityLabel: 'with',
  entityType: 'mid export defuse',
};

export const sampleWithFullData: IEvents = {
  id: 4196,
  type: 'control waste critical',
  state: 'shield afterwards',
  problem: 'pancake',
  detail: 'versus between following',
  severity: 'of ack before',
  entityName: 'dimly',
  entityLabel: 'midst few',
  entityType: 'yahoo weepy casement',
  fix: 'below duh',
  date: dayjs('2024-03-12T07:19'),
};

export const sampleWithNewData: NewEvents = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
