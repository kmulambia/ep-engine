import {Entity, model, property} from '@loopback/repository';

@model()
export class File extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  url: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  encoding?: string;

  @property({
    type: 'string',
  })
  mimetype?: string;

  @property({
    type: 'string',
  })
  size?: string;

  @property({
    type: 'date',
    dataType: 'timestamp',
    defaultFn: 'now'
  })
  created?: string;

  constructor(data?: Partial<File>) {
    super(data);
  }
}

export interface FileRelations {
  // describe navigational properties here
}

export type FileWithRelations = File & FileRelations;
