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
  VendorAccount,
} from '../models';
import {VendorRepository} from '../repositories';

export class VendorVendorAccountController {
  constructor(
    @repository(VendorRepository) protected vendorRepository: VendorRepository,
  ) { }

  @get('/vendors/{id}/vendor-accounts', {
    responses: {
      '200': {
        description: 'Array of Vendor has many VendorAccount',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(VendorAccount)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<VendorAccount>,
  ): Promise<VendorAccount[]> {
    return this.vendorRepository.vendorAccounts(id).find(filter);
  }

  @post('/vendors/{id}/vendor-accounts', {
    responses: {
      '200': {
        description: 'Vendor model instance',
        content: {'application/json': {schema: getModelSchemaRef(VendorAccount)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Vendor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VendorAccount, {
            title: 'NewVendorAccountInVendor',
            exclude: ['id'],
            optional: ['vendorId']
          }),
        },
      },
    }) vendorAccount: Omit<VendorAccount, 'id'>,
  ): Promise<VendorAccount> {
    return this.vendorRepository.vendorAccounts(id).create(vendorAccount);
  }

  @patch('/vendors/{id}/vendor-accounts', {
    responses: {
      '200': {
        description: 'Vendor.VendorAccount PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VendorAccount, {partial: true}),
        },
      },
    })
    vendorAccount: Partial<VendorAccount>,
    @param.query.object('where', getWhereSchemaFor(VendorAccount)) where?: Where<VendorAccount>,
  ): Promise<Count> {
    return this.vendorRepository.vendorAccounts(id).patch(vendorAccount, where);
  }

  @del('/vendors/{id}/vendor-accounts', {
    responses: {
      '200': {
        description: 'Vendor.VendorAccount DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(VendorAccount)) where?: Where<VendorAccount>,
  ): Promise<Count> {
    return this.vendorRepository.vendorAccounts(id).delete(where);
  }
}
