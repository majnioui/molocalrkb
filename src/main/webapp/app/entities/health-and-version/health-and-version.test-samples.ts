import { IHealthAndVersion, NewHealthAndVersion } from './health-and-version.model';

export const sampleWithRequiredData: IHealthAndVersion = {
  id: 18631,
};

export const sampleWithPartialData: IHealthAndVersion = {
  id: 18624,
  version: 'tiger along roughly',
  health: 'soon',
  healthMsg: 'clapboard before',
};

export const sampleWithFullData: IHealthAndVersion = {
  id: 22256,
  version: 'ack',
  health: 'beneath hail',
  healthMsg: 'yellow crush',
};

export const sampleWithNewData: NewHealthAndVersion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
