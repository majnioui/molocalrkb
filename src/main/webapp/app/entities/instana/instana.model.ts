export interface IInstana {
  id: number;
  apitoken?: string | null;
  baseurl?: string | null;
}

export type NewInstana = Omit<IInstana, 'id'> & { id: null };
