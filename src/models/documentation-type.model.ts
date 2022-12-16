import {Entity, model, property, hasMany} from '@loopback/repository';
import {Documentation} from './documentation.model';

@model()
export class DocumentationType extends Entity {
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
  name?: string;

  @property({
    type: 'string',
  })
  details?: string;

  @hasMany(() => Documentation)
  documentations: Documentation[];

  constructor(data?: Partial<DocumentationType>) {
    super(data);
  }
}

export interface DocumentationTypeRelations {
  // describe navigational properties here
}

export type DocumentationTypeWithRelations = DocumentationType & DocumentationTypeRelations;
