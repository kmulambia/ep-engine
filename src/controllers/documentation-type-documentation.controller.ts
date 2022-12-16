import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  DocumentationType,
  Documentation,
} from '../models';
import {DocumentationTypeRepository} from '../repositories';

export class DocumentationTypeDocumentationController {
  constructor(
    @repository(DocumentationTypeRepository) protected documentationTypeRepository: DocumentationTypeRepository,
  ) { }

  @get('/documentation-types/{id}/documentations', {
    responses: {
      '200': {
        description: 'Array of DocumentationType has many Documentation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Documentation)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Documentation>,
  ): Promise<Documentation[]> {
    return this.documentationTypeRepository.documentations(id).find(filter);
  }

  @post('/documentation-types/{id}/documentations', {
    responses: {
      '200': {
        description: 'DocumentationType model instance',
        content: {'application/json': {schema: getModelSchemaRef(Documentation)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DocumentationType.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documentation, {
            title: 'NewDocumentationInDocumentationType',
            exclude: ['id'],
            optional: ['documentationTypeId']
          }),
        },
      },
    }) documentation: Omit<Documentation, 'id'>,
  ): Promise<Documentation> {
    return this.documentationTypeRepository.documentations(id).create(documentation);
  }

  @patch('/documentation-types/{id}/documentations', {
    responses: {
      '200': {
        description: 'DocumentationType.Documentation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documentation, {partial: true}),
        },
      },
    })
    documentation: Partial<Documentation>,
    @param.query.object('where', getWhereSchemaFor(Documentation)) where?: Where<Documentation>,
  ): Promise<Count> {
    return this.documentationTypeRepository.documentations(id).patch(documentation, where);
  }

  @del('/documentation-types/{id}/documentations', {
    responses: {
      '200': {
        description: 'DocumentationType.Documentation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Documentation)) where?: Where<Documentation>,
  ): Promise<Count> {
    return this.documentationTypeRepository.documentations(id).delete(where);
  }
}
