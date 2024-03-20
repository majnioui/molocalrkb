import { IInstalledSoftware, NewInstalledSoftware } from './installed-software.model';

export const sampleWithRequiredData: IInstalledSoftware = {
  id: 28491,
};

export const sampleWithPartialData: IInstalledSoftware = {
  id: 18468,
  version: 'provided across',
  type: 'whoa',
};

export const sampleWithFullData: IInstalledSoftware = {
  id: 11834,
  name: 'ha depend',
  version: 'upon unusual knottily',
  type: 'though',
  usedBy: 'huzzah',
};

export const sampleWithNewData: NewInstalledSoftware = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
