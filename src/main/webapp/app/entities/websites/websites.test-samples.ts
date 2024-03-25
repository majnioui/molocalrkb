import dayjs from 'dayjs/esm';

import { IWebsites, NewWebsites } from './websites.model';

export const sampleWithRequiredData: IWebsites = {
  id: 10259,
};

export const sampleWithPartialData: IWebsites = {
  id: 19043,
  website: 'green until',
  pageViews: 'cheek',
  pageLoads: 'parched who ha',
  onLoadTime: 'off',
  date: dayjs('2024-03-12T10:25'),
};

export const sampleWithFullData: IWebsites = {
  id: 19467,
  website: 'solemnly daily',
  websiteId: 'gift hm runny',
  cls: 'however',
  pageViews: 'er',
  pageLoads: 'bah',
  onLoadTime: 'obediently save',
  date: dayjs('2024-03-11T20:44'),
};

export const sampleWithNewData: NewWebsites = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
