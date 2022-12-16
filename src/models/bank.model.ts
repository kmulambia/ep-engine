import {Entity, model, property, hasMany} from '@loopback/repository';
import {VendorAccount} from './vendor-account.model';

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
    itemType: 'any',
  })
  branches?: any[];

  @property({
    type: 'boolean',
    default: false,
  })
  status?: boolean;

  @hasMany(() => VendorAccount)
  vendorAccounts: VendorAccount[];

  constructor(data?: Partial<Bank>) {
    super(data);
  }
}

export interface BankRelations {
  // describe navigational properties here
}

export type BankWithRelations = Bank & BankRelations;
