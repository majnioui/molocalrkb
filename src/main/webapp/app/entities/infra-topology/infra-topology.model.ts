export interface IInfraTopology {
  id: number;
  plugin?: string | null;
  label?: string | null;
  pluginId?: string | null;
}

export type NewInfraTopology = Omit<IInfraTopology, 'id'> & { id: null };
