export interface IWebsites {
  id: number;
  website?: string | null;
  websiteId?: string | null;
}

export type NewWebsites = Omit<IWebsites, 'id'> & { id: null };
