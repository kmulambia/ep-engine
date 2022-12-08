import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { authenticate } from 'loopback4-authentication';
import { Role } from '../models';
import { RoleRepository } from '../repositories';

export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) { }

  @post('/roles')
  @response(200, {
    description: 'Role model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Role) } },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRole',

          }),
        },
      },
    })
    role: Role,
  ): Promise<Role> {
    return this.roleRepository.create(role);
  }

  @get('/roles/count')
  @response(200, {
    description: 'Role model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async count(
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.count(where);
  }

  @get('/roles')
  @response(200, {
    description: 'Array of Role model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Role, { includeRelations: true }),
        },
      },
    },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async find(
    @param.filter(Role) filter?: Filter<Role>,
  ): Promise<Role[]> {
    return this.roleRepository.find(filter);
  }

  @patch('/roles')
  @response(200, {
    description: 'Role PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { partial: true }),
        },
      },
    })
    role: Role,
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.updateAll(role, where);
  }

  @get('/roles/{id}')
  @response(200, {
    description: 'Role model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Role, { includeRelations: true }),
      },
    },
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Role, { exclude: 'where' }) filter?: FilterExcludingWhere<Role>
  ): Promise<Role> {
    return this.roleRepository.findById(id, filter);
  }

  @patch('/roles/{id}')
  @response(204, {
    description: 'Role PATCH success',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { partial: true }),
        },
      },
    })
    role: Role,
  ): Promise<void> {
    await this.roleRepository.updateById(id, role);
  }

  @put('/roles/{id}')
  @response(204, {
    description: 'Role PUT success',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() role: Role,
  ): Promise<void> {
    await this.roleRepository.replaceById(id, role);
  }

  @del('/roles/{id}')
  @response(204, {
    description: 'Role DELETE success',
  })
  /**authentication**/
  @authenticate('jwt')
  /***/
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.roleRepository.deleteById(id);
  }
}
