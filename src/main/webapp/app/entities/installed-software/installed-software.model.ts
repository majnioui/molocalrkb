export interface IInstalledSoftware {
  id: number;
  name?: string | null;
  version?: string | null;
  type?: string | null;
  usedBy?: string | null;
}

export type NewInstalledSoftware = Omit<IInstalledSoftware, 'id'> & { id: null };
