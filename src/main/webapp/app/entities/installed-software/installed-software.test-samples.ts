import { IInstalledSoftware, NewInstalledSoftware } from './installed-software.model';

export const sampleWithRequiredData: IInstalledSoftware = {
  id: 27552,
};

export const sampleWithPartialData: IInstalledSoftware = {
  id: 31000,
  name: 'like',
};

export const sampleWithFullData: IInstalledSoftware = {
  id: 2841,
  name: 'mix till',
  version: 'overconfidently gosh opposite',
  type: 'over diligently',
  usedBy: 'yippee',
};

export const sampleWithNewData: NewInstalledSoftware = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
