import {Entity, model, property} from '@loopback/repository';

@model()
export class Sample extends Entity {

  constructor(data?: Partial<Sample>) {
    super(data);
  }
}

export interface SampleRelations {
  // describe navigational properties here
}

export type SampleWithRelations = Sample & SampleRelations;
