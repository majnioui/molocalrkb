import dayjs from 'dayjs/esm';

export interface IAgentIssues {
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
  atTime?: dayjs.Dayjs | null;
}

export type NewAgentIssues = Omit<IAgentIssues, 'id'> & { id: null };
