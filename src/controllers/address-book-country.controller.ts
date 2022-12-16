import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  AddressBook,
  Country,
} from '../models';
import {AddressBookRepository} from '../repositories';

export class AddressBookCountryController {
  constructor(
    @repository(AddressBookRepository)
    public addressBookRepository: AddressBookRepository,
  ) { }

  @get('/address-books/{id}/country', {
    responses: {
      '200': {
        description: 'Country belonging to AddressBook',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Country)},
          },
        },
      },
    },
  })
  async getCountry(
    @param.path.number('id') id: typeof AddressBook.prototype.id,
  ): Promise<Country> {
    return this.addressBookRepository.country(id);
  }
}
