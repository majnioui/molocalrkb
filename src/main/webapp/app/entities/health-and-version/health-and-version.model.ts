export interface IHealthAndVersion {
  id: number;
  version?: string | null;
  health?: string | null;
  healthMsg?: string | null;
}

export type NewHealthAndVersion = Omit<IHealthAndVersion, 'id'> & { id: null };
