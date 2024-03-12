import { IInstana, NewInstana } from './instana.model';

export const sampleWithRequiredData: IInstana = {
  id: 21940,
};

export const sampleWithPartialData: IInstana = {
  id: 31970,
  apitoken: 'these',
  baseurl: 'for ick load',
};

export const sampleWithFullData: IInstana = {
  id: 13805,
  apitoken: 'minus yieldingly inasmuch',
  baseurl: 'sweetly',
};

export const sampleWithNewData: NewInstana = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
