import { Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {
    indexes: {
      uniqueCode: {
        keys: {
          code: 1,
          userId:1,
          created:1
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class Otp extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
    required: true,
  })
  id: string;

  @property({
    type: 'number',
  })
  code?: number;

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

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Otp>) {
    super(data);
  }
}

export interface OtpRelations {
  // describe navigational properties here
}

export type OtpWithRelations = Otp & OtpRelations;
