import {Entity, model, property} from '@loopback/repository';

@model()
export class Country extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  fullname?: string;

  @property({
    type: 'string',
  })
  pcode?: string;


  constructor(data?: Partial<Country>) {
    super(data);
  }
}

export interface CountryRelations {
  // describe navigational properties here
}

export type CountryWithRelations = Country & CountryRelations;
