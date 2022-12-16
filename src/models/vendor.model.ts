import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {VendorType} from './vendor-type.model';
import {VendorAccount} from './vendor-account.model';
import {BusinessSegment} from './business-segment.model';
import {User} from './user.model';
import {VendorUser} from './vendor-user.model';

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

  @belongsTo(() => VendorType)
  vendorTypeId: number;

  @hasMany(() => VendorAccount)
  vendorAccounts: VendorAccount[];

  @belongsTo(() => BusinessSegment)
  businessSegmentId: number;

  @hasMany(() => User, {through: {model: () => VendorUser}})
  users: User[];

  constructor(data?: Partial<Vendor>) {
    super(data);
  }
}

export interface VendorRelations {
  // describe navigational properties here
}

export type VendorWithRelations = Vendor & VendorRelations;
