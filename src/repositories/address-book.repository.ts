import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AddressBook, AddressBookRelations, Country} from '../models';
import {CountryRepository} from './country.repository';

export class AddressBookRepository extends DefaultCrudRepository<
  AddressBook,
  typeof AddressBook.prototype.id,
  AddressBookRelations
> {

  public readonly country: BelongsToAccessor<Country, typeof AddressBook.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>,
  ) {
    super(AddressBook, dataSource);
    this.country = this.createBelongsToAccessorFor('country', countryRepositoryGetter,);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
  }
}
