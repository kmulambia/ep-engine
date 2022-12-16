import {Entity, model, property} from '@loopback/repository';

@model()
export class VendorAccount extends Entity {
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
  number?: string;

  @property({
    type: 'string',
    required: true,
  })
  Branch: string;

  @property({
    type: 'string',
  })
  currency?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'number',
  })
  vendorId?: number;

  @property({
    type: 'number',
  })
  bankId?: number;

  constructor(data?: Partial<VendorAccount>) {
    super(data);
  }
}

export interface VendorAccountRelations {
  // describe navigational properties here
}

export type VendorAccountWithRelations = VendorAccount & VendorAccountRelations;
