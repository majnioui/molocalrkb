import { IWebsites, NewWebsites } from './websites.model';

export const sampleWithRequiredData: IWebsites = {
  id: 5672,
};

export const sampleWithPartialData: IWebsites = {
  id: 1277,
};

export const sampleWithFullData: IWebsites = {
  id: 2187,
  website: 'yowza',
  websiteId: 'proper save',
};

export const sampleWithNewData: NewWebsites = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
