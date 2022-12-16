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
User,
VendorUser,
Vendor,
} from '../models';
import {UserRepository} from '../repositories';

export class UserVendorController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/vendors', {
    responses: {
      '200': {
        description: 'Array of User has many Vendor through VendorUser',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Vendor)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Vendor>,
  ): Promise<Vendor[]> {
    return this.userRepository.vendors(id).find(filter);
  }

  @post('/users/{id}/vendors', {
    responses: {
      '200': {
        description: 'create a Vendor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Vendor)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendor, {
            title: 'NewVendorInUser',
            exclude: ['id'],
          }),
        },
      },
    }) vendor: Omit<Vendor, 'id'>,
  ): Promise<Vendor> {
    return this.userRepository.vendors(id).create(vendor);
  }

  @patch('/users/{id}/vendors', {
    responses: {
      '200': {
        description: 'User.Vendor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendor, {partial: true}),
        },
      },
    })
    vendor: Partial<Vendor>,
    @param.query.object('where', getWhereSchemaFor(Vendor)) where?: Where<Vendor>,
  ): Promise<Count> {
    return this.userRepository.vendors(id).patch(vendor, where);
  }

  @del('/users/{id}/vendors', {
    responses: {
      '200': {
        description: 'User.Vendor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Vendor)) where?: Where<Vendor>,
  ): Promise<Count> {
    return this.userRepository.vendors(id).delete(where);
  }
}
