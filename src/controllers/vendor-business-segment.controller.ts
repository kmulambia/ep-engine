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
  BusinessSegment,
} from '../models';
import {VendorRepository} from '../repositories';

export class VendorBusinessSegmentController {
  constructor(
    @repository(VendorRepository)
    public vendorRepository: VendorRepository,
  ) { }

  @get('/vendors/{id}/business-segment', {
    responses: {
      '200': {
        description: 'BusinessSegment belonging to Vendor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(BusinessSegment)},
          },
        },
      },
    },
  })
  async getBusinessSegment(
    @param.path.number('id') id: typeof Vendor.prototype.id,
  ): Promise<BusinessSegment> {
    return this.vendorRepository.businessSegment(id);
  }
}
