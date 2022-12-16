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
  Country,
} from '../models';
import {VendorRepository} from '../repositories';

export class VendorCountryController {
  constructor(
    @repository(VendorRepository)
    public vendorRepository: VendorRepository,
  ) { }

  @get('/vendors/{id}/country', {
    responses: {
      '200': {
        description: 'Country belonging to Vendor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Country)},
          },
        },
      },
    },
  })
  async getCountry(
    @param.path.number('id') id: typeof Vendor.prototype.id,
  ): Promise<Country> {
    return this.vendorRepository.country(id);
  }
}
