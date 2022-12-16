import {Entity, model, property, hasOne, referencesMany, belongsTo, hasMany} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';
import {Acl} from './acl.model';
import {Role} from './role.model';
import {Vendor} from './vendor.model';
import {VendorUser} from './vendor-user.model';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
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
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string'
  })
  phone: string;

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


  // @property({
  //   type: 'any',
  // })
  @hasMany(() => Vendor, {through: {model: () => VendorUser}})
  vendors: Vendor[];
  // data1?: any;

  // @property({
  //   type: 'object',
  // })
  // data2?: object;

  // @property({
  //   type: 'array',
  //   itemType: 'string',
  // })
  // data3?: string[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @referencesMany(() => Acl, {name: 'acls'})
  acl?: string[];

  @belongsTo(() => Role ,{name: 'role'})
  roleId: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
