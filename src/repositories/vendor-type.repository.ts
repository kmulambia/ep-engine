import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {VendorType, VendorTypeRelations} from '../models';

export class VendorTypeRepository extends DefaultCrudRepository<
  VendorType,
  typeof VendorType.prototype.id,
  VendorTypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(VendorType, dataSource);
  }
}
