import {Entity, model, property} from '@loopback/repository';

@model()
export class Log extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  actor: string;

  @property({
    type: 'string',
    required: true,
  })
  action: string;

  @property({
    name: 'entityId',
    type: 'string',
    required: true,
  })
  entityId: string;

  @property({
    type: 'object',
  })
  entity?: object;

  @property({
    type: 'any',
  })
  before?: any;

  @property({
    type: 'any',
  })
  after?: any;

  @property({
    type: 'boolean',
    default: false
  })
  status: boolean;
  
  @property({
    type: 'date',
    dataType: 'timestamp',
    defaultFn: 'now'
  })
  created?: string;

  constructor(data?: Partial<Log>) {
    super(data);
  }
}

export interface LogRelations {
  // describe navigational properties here
}

export type LogWithRelations = Log & LogRelations;
