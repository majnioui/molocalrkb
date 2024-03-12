import dayjs from 'dayjs/esm';

import { IEvents, NewEvents } from './events.model';

export const sampleWithRequiredData: IEvents = {
  id: 27932,
};

export const sampleWithPartialData: IEvents = {
  id: 6993,
  state: 'pigsty mmm',
  problem: 'stand',
  detail: 'pish phew pleasant',
  entityLabel: 'sticky quickly lest',
  entityType: 'cooperative even',
};

export const sampleWithFullData: IEvents = {
  id: 25634,
  type: 'meh onto',
  state: 'leach shed well-informed',
  problem: 'jubilant hastily',
  detail: 'verify for duh',
  severity: 'continually mountainous dapper',
  entityName: 'into',
  entityLabel: 'behave sedately upward',
  entityType: 'scared safely',
  fix: 'junior warmhearted truly',
  date: dayjs('2024-03-12T10:03'),
};

export const sampleWithNewData: NewEvents = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
