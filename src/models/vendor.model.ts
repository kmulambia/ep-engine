import {Entity, model, property} from '@loopback/repository';

@model()
export class Vendor extends Entity {
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
  country?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  alt_phone?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  alt_email?: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  constructor(data?: Partial<Vendor>) {
    super(data);
  }
}

export interface VendorRelations {
  // describe navigational properties here
}

export type VendorWithRelations = Vendor & VendorRelations;
