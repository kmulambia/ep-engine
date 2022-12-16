import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    indexes: {
      uniqueVendorUser: {
        keys: {
          vendorId: 1,
          userId: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class VendorUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
    required: true,
  })
  id: string;

  @property({
    type: 'date',
    dataType: 'timestamp',
    defaultFn: 'now'
  })
  created?: string;

  @property({
    type: 'boolean',
    default: false
  })
  status: boolean;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'number',
  })
  vendorId?: number;

  constructor(data?: Partial<VendorUser>) {
    super(data);
  }
}

export interface VendorUserRelations {
  // describe navigational properties here
}

export type VendorUserWithRelations = VendorUser & VendorUserRelations;
