import { IInstana, NewInstana } from './instana.model';

export const sampleWithRequiredData: IInstana = {
  id: 13019,
};

export const sampleWithPartialData: IInstana = {
  id: 32170,
  apitoken: 'unless',
  baseurl: 'exactly helplessly',
};

export const sampleWithFullData: IInstana = {
  id: 7882,
  apitoken: 'only gratefully insolence',
  baseurl: 'hide',
};

export const sampleWithNewData: NewInstana = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
