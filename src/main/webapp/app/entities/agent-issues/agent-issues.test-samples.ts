import dayjs from 'dayjs/esm';

import { IAgentIssues, NewAgentIssues } from './agent-issues.model';

export const sampleWithRequiredData: IAgentIssues = {
  id: 20043,
};

export const sampleWithPartialData: IAgentIssues = {
  id: 13668,
  detail: 'ah',
  severity: 'bagpipe cultured yippee',
};

export const sampleWithFullData: IAgentIssues = {
  id: 30367,
  type: 'pro husband',
  state: 'gee portly than',
  problem: 'frankly',
  detail: 'yowza',
  severity: 'yahoo witty pish',
  entityName: 'reappraise',
  entityLabel: 'joint anenst geez',
  entityType: 'zowie gadzooks while',
  fix: 'er wherever whose',
  atTime: dayjs('2024-03-12T02:46'),
};

export const sampleWithNewData: NewAgentIssues = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
