import dayjs from 'dayjs/esm';

export interface IWebsites {
  id: number;
  website?: string | null;
  websiteId?: string | null;
  cls?: string | null;
  pageViews?: string | null;
  pageLoads?: string | null;
  onLoadTime?: string | null;
  date?: dayjs.Dayjs | null;
}

export type NewWebsites = Omit<IWebsites, 'id'> & { id: null };
