import {Entity, model, property} from '@loopback/repository';

@model()
export class Bank extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  details?: string;

  @property({
    type: 'string',
  })
  logo_url?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  branches?: string[];

  @property({
    type: 'boolean',
    default: false,
  })
  status?: boolean;

  constructor(data?: Partial<Bank>) {
    super(data);
  }
}

export interface BankRelations {
  // describe navigational properties here
}

export type BankWithRelations = Bank & BankRelations;
