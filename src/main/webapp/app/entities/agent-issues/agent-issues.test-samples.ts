import dayjs from 'dayjs/esm';

import { IAgentIssues, NewAgentIssues } from './agent-issues.model';

export const sampleWithRequiredData: IAgentIssues = {
  id: 15758,
};

export const sampleWithPartialData: IAgentIssues = {
  id: 8212,
  type: 'shave nutty',
  entityName: 'yippee',
  entityType: 'sheepishly',
};

export const sampleWithFullData: IAgentIssues = {
  id: 10185,
  type: 'whereas midst',
  state: 'till whose wherever',
  problem: 'crowded reassuringly',
  detail: 'fervently',
  severity: 'competent what cuddly',
  entityName: 'when whose resuscitate',
  entityLabel: 'and marry',
  entityType: 'aside affiliate considering',
  fix: 'ligand',
  atTime: dayjs('2024-03-12T11:18'),
};

export const sampleWithNewData: NewAgentIssues = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
