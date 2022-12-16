import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AddressBook, AddressBookRelations} from '../models';

export class AddressBookRepository extends DefaultCrudRepository<
  AddressBook,
  typeof AddressBook.prototype.id,
  AddressBookRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(AddressBook, dataSource);
  }
}
