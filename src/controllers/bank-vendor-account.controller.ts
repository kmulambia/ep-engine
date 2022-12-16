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
  Bank,
  VendorAccount,
} from '../models';
import {BankRepository} from '../repositories';

export class BankVendorAccountController {
  constructor(
    @repository(BankRepository) protected bankRepository: BankRepository,
  ) { }

  @get('/banks/{id}/vendor-accounts', {
    responses: {
      '200': {
        description: 'Array of Bank has many VendorAccount',
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
    return this.bankRepository.vendorAccounts(id).find(filter);
  }

  @post('/banks/{id}/vendor-accounts', {
    responses: {
      '200': {
        description: 'Bank model instance',
        content: {'application/json': {schema: getModelSchemaRef(VendorAccount)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Bank.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VendorAccount, {
            title: 'NewVendorAccountInBank',
            exclude: ['id'],
            optional: ['bankId']
          }),
        },
      },
    }) vendorAccount: Omit<VendorAccount, 'id'>,
  ): Promise<VendorAccount> {
    return this.bankRepository.vendorAccounts(id).create(vendorAccount);
  }

  @patch('/banks/{id}/vendor-accounts', {
    responses: {
      '200': {
        description: 'Bank.VendorAccount PATCH success count',
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
    return this.bankRepository.vendorAccounts(id).patch(vendorAccount, where);
  }

  @del('/banks/{id}/vendor-accounts', {
    responses: {
      '200': {
        description: 'Bank.VendorAccount DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(VendorAccount)) where?: Where<VendorAccount>,
  ): Promise<Count> {
    return this.bankRepository.vendorAccounts(id).delete(where);
  }
}
