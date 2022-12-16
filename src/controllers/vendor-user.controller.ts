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
Vendor,
VendorUser,
User,
} from '../models';
import {VendorRepository} from '../repositories';

export class VendorUserController {
  constructor(
    @repository(VendorRepository) protected vendorRepository: VendorRepository,
  ) { }

  @get('/vendors/{id}/users', {
    responses: {
      '200': {
        description: 'Array of Vendor has many User through VendorUser',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    return this.vendorRepository.users(id).find(filter);
  }

  @post('/vendors/{id}/users', {
    responses: {
      '200': {
        description: 'create a User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Vendor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInVendor',
            exclude: ['id'],
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.vendorRepository.users(id).create(user);
  }

  @patch('/vendors/{id}/users', {
    responses: {
      '200': {
        description: 'Vendor.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.vendorRepository.users(id).patch(user, where);
  }

  @del('/vendors/{id}/users', {
    responses: {
      '200': {
        description: 'Vendor.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.vendorRepository.users(id).delete(where);
  }
}
