import { IInstana, NewInstana } from './instana.model';

export const sampleWithRequiredData: IInstana = {
  id: 23550,
};

export const sampleWithPartialData: IInstana = {
  id: 24014,
  baseurl: 'regarding',
};

export const sampleWithFullData: IInstana = {
  id: 22328,
  apitoken: 'average',
  baseurl: 'boo',
};

export const sampleWithNewData: NewInstana = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
