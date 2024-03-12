import { IInfraTopology, NewInfraTopology } from './infra-topology.model';

export const sampleWithRequiredData: IInfraTopology = {
  id: 29215,
};

export const sampleWithPartialData: IInfraTopology = {
  id: 2907,
  plugin: 'kitten',
  label: 'fooey hence',
};

export const sampleWithFullData: IInfraTopology = {
  id: 28563,
  plugin: 'plonk wisely yahoo',
  label: 'warrior ouch',
  pluginId: 'mysteriously cross after',
};

export const sampleWithNewData: NewInfraTopology = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
