import { IWebsites, NewWebsites } from './websites.model';

export const sampleWithRequiredData: IWebsites = {
  id: 28988,
};

export const sampleWithPartialData: IWebsites = {
  id: 3529,
  website: 'distorted or strictly',
};

export const sampleWithFullData: IWebsites = {
  id: 1903,
  website: 'incense',
  websiteId: 'cayenne stepdaughter dense',
};

export const sampleWithNewData: NewWebsites = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
