import {Entity, model, property} from '@loopback/repository';

@model()
export class AddressBook extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  country_region: string;

  @property({
    type: 'string',
  })
  address_line_1?: string;

  @property({
    type: 'string',
  })
  address_line_2?: string;

  @property({
    type: 'string',
  })
  area_town?: string;

  @property({
    type: 'string',
  })
  postal_code?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  save_as?: string;

  @property({
    type: 'any',
  })
  entityId?: any;

  @property({
    type: 'string',
  })
  entityType?: string;

  @property({
    type: 'boolean',
  })
  default?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  status?: boolean;


  constructor(data?: Partial<AddressBook>) {
    super(data);
  }
}

export interface AddressBookRelations {
  // describe navigational properties here
}

export type AddressBookWithRelations = AddressBook & AddressBookRelations;
