import { IAgentIssues, NewAgentIssues } from './agent-issues.model';

export const sampleWithRequiredData: IAgentIssues = {
  id: 5599,
};

export const sampleWithPartialData: IAgentIssues = {
  id: 21110,
  type: 'while sorrowful till',
  state: 'blond',
  entityLabel: 'catch',
  fix: 'naturally gee uh-huh',
};

export const sampleWithFullData: IAgentIssues = {
  id: 8034,
  type: 'littleneck',
  state: 'furrow',
  problem: 'chief wreak lest',
  detail: 'irritably leading',
  severity: 'dignify cheerfully tomorrow',
  entityName: 'knowledgeably brass thankfully',
  entityLabel: 'er',
  entityType: 'do through limply',
  fix: 'puzzle dream',
};

export const sampleWithNewData: NewAgentIssues = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
