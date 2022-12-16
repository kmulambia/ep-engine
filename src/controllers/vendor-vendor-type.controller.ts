import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Vendor,
  VendorType,
} from '../models';
import {VendorRepository} from '../repositories';

export class VendorVendorTypeController {
  constructor(
    @repository(VendorRepository)
    public vendorRepository: VendorRepository,
  ) { }

  @get('/vendors/{id}/vendor-type', {
    responses: {
      '200': {
        description: 'VendorType belonging to Vendor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(VendorType)},
          },
        },
      },
    },
  })
  async getVendorType(
    @param.path.number('id') id: typeof Vendor.prototype.id,
  ): Promise<VendorType> {
    return this.vendorRepository.vendorType(id);
  }
}
