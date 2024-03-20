import { IInfraTopology, NewInfraTopology } from './infra-topology.model';

export const sampleWithRequiredData: IInfraTopology = {
  id: 26084,
};

export const sampleWithPartialData: IInfraTopology = {
  id: 17715,
  plugin: 'yuck each',
  pluginId: 'spay when spike',
};

export const sampleWithFullData: IInfraTopology = {
  id: 24867,
  plugin: 'ack',
  label: 'chargesheet given',
  pluginId: 'equatorial variable',
};

export const sampleWithNewData: NewInfraTopology = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
