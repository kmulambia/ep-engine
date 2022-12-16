import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {VendorAccount, VendorAccountRelations} from '../models';

export class VendorAccountRepository extends DefaultCrudRepository<
  VendorAccount,
  typeof VendorAccount.prototype.id,
  VendorAccountRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(VendorAccount, dataSource);
  }
}
