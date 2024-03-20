import { IHealthAndVersion, NewHealthAndVersion } from './health-and-version.model';

export const sampleWithRequiredData: IHealthAndVersion = {
  id: 4481,
};

export const sampleWithPartialData: IHealthAndVersion = {
  id: 2226,
  health: 'pan',
  healthMsg: 'whether for',
};

export const sampleWithFullData: IHealthAndVersion = {
  id: 1936,
  version: 'furthermore anticodon leaker',
  health: 'following',
  healthMsg: 'mysteriously spar frankly',
};

export const sampleWithNewData: NewHealthAndVersion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
