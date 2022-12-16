import { Entity, model, property } from '@loopback/repository';

@model()
export class Documentation extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
    required: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'any',
  })
  details?: any;

  @property({
    type: 'date',
  })
  issuing_body?: string;

  @property({
    type: 'date',
  })
  issue_date?: string;

  @property({
    type: 'string',
  })
  expiry_date?: string

  @property({
    type: 'date',
    dataType: 'timestamp',
    defaultFn: 'now'
  })
  created?: string;

  @property({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @property({
    type: 'string',
  })
  documentationTypeId?: string;

  constructor(data?: Partial<Documentation>) {
    super(data);
  }
}

export interface DocumentationRelations {
  // describe navigational properties here
}

export type DocumentationWithRelations = Documentation & DocumentationRelations;
