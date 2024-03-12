import dayjs from 'dayjs/esm';

export interface IEvents {
  id: number;
  type?: string | null;
  state?: string | null;
  problem?: string | null;
  detail?: string | null;
  severity?: string | null;
  entityName?: string | null;
  entityLabel?: string | null;
  entityType?: string | null;
  fix?: string | null;
  date?: dayjs.Dayjs | null;
}

export type NewEvents = Omit<IEvents, 'id'> & { id: null };
