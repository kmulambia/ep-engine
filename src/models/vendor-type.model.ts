import {Entity, model, property} from '@loopback/repository';

@model()
export class VendorType extends Entity {
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


  constructor(data?: Partial<VendorType>) {
    super(data);
  }
}

export interface VendorTypeRelations {
  // describe navigational properties here
}

export type VendorTypeWithRelations = VendorType & VendorTypeRelations;
