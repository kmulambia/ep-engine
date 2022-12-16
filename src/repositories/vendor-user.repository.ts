import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {VendorUser, VendorUserRelations} from '../models';

export class VendorUserRepository extends DefaultCrudRepository<
  VendorUser,
  typeof VendorUser.prototype.id,
  VendorUserRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(VendorUser, dataSource);
  }
}
