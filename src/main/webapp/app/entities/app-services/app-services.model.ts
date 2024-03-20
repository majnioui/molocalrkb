import dayjs from 'dayjs/esm';

export interface IAppServices {
  id: number;
  servId?: string | null;
  label?: string | null;
  types?: string | null;
  technologies?: string | null;
  entityType?: string | null;
  erronCalls?: string | null;
  calls?: string | null;
  latency?: string | null;
  date?: dayjs.Dayjs | null;
}

export type NewAppServices = Omit<IAppServices, 'id'> & { id: null };
