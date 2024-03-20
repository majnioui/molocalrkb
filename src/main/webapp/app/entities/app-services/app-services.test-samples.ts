import dayjs from 'dayjs/esm';

import { IAppServices, NewAppServices } from './app-services.model';

export const sampleWithRequiredData: IAppServices = {
  id: 17712,
};

export const sampleWithPartialData: IAppServices = {
  id: 27929,
  erronCalls: 'tuition failing senior',
  calls: 'and irritably elderly',
  date: dayjs('2024-03-19T20:08'),
};

export const sampleWithFullData: IAppServices = {
  id: 32135,
  servId: 'melt',
  label: 'meh watery',
  types: 'ingratiate onto bring',
  technologies: 'mid verbally gosh',
  entityType: 'turmeric once',
  erronCalls: 'horse palace reclamation',
  calls: 'hence until by',
  latency: 'besides virtuous while',
  date: dayjs('2024-03-20T08:34'),
};

export const sampleWithNewData: NewAppServices = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
